# Traces 

JAM DUNA is able to pass fallback + safrole + reports-l0 from @davxy [Import Traces GP v0.6.5](https://github.com/davxy/jam-test-vectors/pull/45).

For `traces/reports-l0`, there are many uses of SBRK in 11 test vectors that involve an accumulate invocation.  We include execution traces, following JavaJAM's trace model for simple `diff` comparison after a `cut` operation.  Teams should follow [Jan's sbrk advice](https://paritytech.github.io/matrix-archiver/archive/_21ddsEwXlCWnreEGuqXZ_3Apolkadot.io/index.html#$_RkIlMDNZrROw_6WDXpbllO2VSbjY1FNTIfDjVZhhdw) to pass these cases. 

Many slightly different solutions managing a heap are possible that pass these `reports-l0` 11 cases.  Below is a Go implementation of SBRK and a matching memory model, basically what we have in our Go implementation.  

Note that the `sbrk` instruction is expected to be replaced with a host function (see [here](https://paritytech.github.io/matrix-archiver/archive/_21ddsEwXlCWnreEGuqXZ_3Apolkadot.io/index.html#$JU2fAJu00hr9dA0Yta2nmFhErxNHT5f_hXn2PZyckjg)) so any implementation work here should be seen as temporary.    

## sbrk Implementation in Go

```
if valueA == 0 {
	// The guest is querying the current heap pointer
	vm.WriteRegister(registerIndexD, uint64(vm.Ram.current_heap_pointer))
	return
}

// Record current heap pointer to return
result = uint64(vm.Ram.current_heap_pointer)

next_page_boundary := P_func(vm.Ram.current_heap_pointer)
new_heap_pointer := uint64(vm.Ram.current_heap_pointer) + valueA

if new_heap_pointer > uint64(next_page_boundary) {
	final_boundary := P_func(uint32(new_heap_pointer))
	idx_start := next_page_boundary / Z_P
	idx_end := final_boundary / Z_P
	page_count := idx_end - idx_start

    vm.Ram.allocatePages(idx_start, page_count)
}

// Advance the heap
vm.Ram.current_heap_pointer = uint32(new_heap_pointer)
```

## Memory model 

The above utilizes a RAM object to support all read and writes via `WriteRAMBytes` and `ReadRAMBytes` methods, used in LOAD + STORE operations, and many host functions (READ, WRITE, INFO, etc.)

```
type RAM struct {
	stack_address        uint32
	stack_address_end    uint32
	rw_data_address      uint32
	rw_data_address_end  uint32
	ro_data_address      uint32
	ro_data_address_end  uint32
	current_heap_pointer uint32
	output_address       uint32
	output_end           uint32

	stack   []byte
	rw_data []byte
	ro_data []byte
	output  []byte
}

func NewRAM(o_size uint32, w_size uint32, p_s uint32) *RAM {
	// read-only
	ro_data_address := uint32(Z_Z)
	ro_data_address_end := ro_data_address + o_size

	// read-write
	rw_data_address := uint32(2 * Z_Z)
	rw_data_address_end := rw_data_address + Z_func(o_size)
	current_heap_pointer := rw_data_address_end + Z_P  // Note: extra Z_P is debatable

	// stack
	stack_address := uint32(0xFFFFFFFF) - 2*Z_Z - Z_I - p_s + 1
	stack_address_end := stack_address + p_s

	// output
	a_size := uint32(Z_Z + Z_I - 1)
	output_address := uint32(0xFFFFFFFF) - Z_Z - Z_I + 1
	output_end := uint32(0xFFFFFFFF)

	return &RAM{
		stack_address:        stack_address,
		stack_address_end:    stack_address_end,
		rw_data_address:      rw_data_address,
		rw_data_address_end:  rw_data_address_end,
		ro_data_address:      ro_data_address,
		ro_data_address_end:  ro_data_address_end,
		current_heap_pointer: current_heap_pointer,
		output_address:       output_address,
		output_end:           output_end,
		stack:                make([]byte, p_s),
		rw_data:              make([]byte, rw_data_address_end-rw_data_address),
		ro_data:              make([]byte, ro_data_address_end-ro_data_address),
		output:               make([]byte, a_size),
	}
}

func (ram *RAM) WriteRAMBytes(address uint32, data []byte) uint64 {
	length := uint32(len(data))
	end := address + length

	switch {
	case address >= ram.output_address && end <= ram.output_end:
		offset := address - ram.output_address
		copy(ram.output[offset:], data)
		return OK
	case address >= ram.stack_address && end <= ram.stack_address_end:
		offset := address - ram.stack_address
		copy(ram.stack[offset:], data)
		return OK
	case address >= ram.rw_data_address && end <= Z_func(ram.current_heap_pointer):
		offset := address - ram.rw_data_address
		copy(ram.rw_data[offset:], data)
		return OK
	case address >= ram.ro_data_address && end <= ram.ro_data_address_end:
		offset := address - ram.ro_data_address
		copy(ram.ro_data[offset:], data)
		return OK
	default:
		return OOB
	}
}

func (ram *RAM) ReadRAMBytes(address uint32, length uint32) ([]byte, uint64) {
	end := address + length

	if address >= ram.output_address && end <= ram.output_end {
		offset := address - ram.output_address
		if offset+length > uint32(len(ram.output)) {
			panic(fmt.Sprintf("output read overflow: offset=%d len=%d cap=%d", offset, length, len(ram.output)))
		}
		return ram.output[offset : offset+length], OK
	}

	if address >= ram.stack_address && end <= ram.stack_address_end {
		offset := address - ram.stack_address
		if offset+length > uint32(len(ram.stack)) {
			panic(fmt.Sprintf("stack read overflow: address %x ram.stack_address %x offset=%d len=%d cap=%d (range: %x to %x)",
				address, ram.stack_address, offset, length, len(ram.stack), ram.stack_address, ram.stack_address_end))
		}
		return ram.stack[offset : offset+length], OK
	}

	if address >= ram.rw_data_address && end <= Z_func(ram.current_heap_pointer) {
		offset := address - ram.rw_data_address
		if offset+length > uint32(len(ram.rw_data)) {
			panic(fmt.Sprintf("rw_data read overflow: offset=%d len=%d cap=%d", offset, length, len(ram.rw_data)))
		}
		return ram.rw_data[offset : offset+length], OK
	}

	if address >= ram.ro_data_address && end <= ram.ro_data_address_end {
		offset := address - ram.ro_data_address
		if offset+length > uint32(len(ram.ro_data)) {
			panic(fmt.Sprintf("ro_data read overflow: offset=%d len=%d cap=%d", offset, length, len(ram.ro_data)))
		}
		return ram.ro_data[offset : offset+length], OK
	}

	log.Warn("ok", "invalid ReadRAMBytes", "addr", fmt.Sprintf("%x", address), "l", length)
	return nil, OOB
}

func (ram *RAM) allocatePages(startPage uint32, count uint32) {
	required := (startPage + count) * Z_P
	if uint32(len(ram.rw_data)) < required {
		// Grow rw_data to fit new allocation
		newData := make([]byte, required)
		copy(newData, ram.rw_data)
		ram.rw_data = newData
	}
}
```




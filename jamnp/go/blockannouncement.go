package jamnp

import (
	"bytes"
	"encoding/binary"
)

type BlockAnnouncement struct {
	Timeslot uint32
}

// ToBytes for JAMSNPBlockAnnouncement
func (ann *BlockAnnouncement) ToBytes() ([]byte, error) {
	buf := new(bytes.Buffer)

	// Serialize Timeslot (4 bytes)
	if err := binary.Write(buf, binary.BigEndian, ann.Timeslot); err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// FromBytes for JAMSNPBlockAnnouncement
func (ann *BlockAnnouncement) FromBytes(data []byte) error {
	buf := bytes.NewReader(data)

	// Deserialize Timeslot (4 bytes)
	if err := binary.Read(buf, binary.BigEndian, &ann.Timeslot); err != nil {
		return err
	}

	return nil
}

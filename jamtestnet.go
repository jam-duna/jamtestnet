package main

import (
	"flag"
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/BurntSushi/toml"
)

// Config structure to map the TOML file
type Config struct {
	Jamchain struct {
		DefaultArgs []string `toml:"default_args"`
		Chain       string   `toml:"chain"`
		V           int      `toml:"V"`
		C           int      `toml:"C"`
		E           int      `toml:"E"`
		P           int      `toml:"P"`
		Y           int      `toml:"Y"`
	} `toml:"jamchain"`
	Validators []Validator `toml:"validator"`
}

type Validator struct {
	Name    string `toml:"name"`
	Command string `toml:"command"`
}

// Replaces placeholders in command args with dynamic values
func replacePlaceholders(command, defaultArgs string, validatorIndex int, validatorName string, timePlusDelay int64) string {
	// Replace placeholders in default args and command
	replaced := strings.ReplaceAll(defaultArgs, "${TIMESTAMP}", fmt.Sprintf("%d", timePlusDelay))
	replaced = strings.ReplaceAll(replaced, "${VALIDATORINDEX}", fmt.Sprintf("%d", validatorIndex))
	replaced = strings.ReplaceAll(replaced, "${NODENAME}", validatorName)

	finalCommand := command + " " + replaced + fmt.Sprintf("> jamtestnet-%d-%d.log", timePlusDelay, validatorIndex)
	return finalCommand
}

// runValidator to run each validator command
func runValidator(validatorIndex int, validatorName, command string, done chan bool) {

	// Start the process
	cmd := exec.Command("sh", "-c", command)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
  fmt.Printf("Starting JAM validator %d (%s): %s\n", validatorIndex, validatorName, command)

	// Start the process
	err := cmd.Start()
	if err != nil {
		log.Fatalf("Failed to start validator %s: %v", validatorName, err)
	}

	// Wait for the process to finish or kill signal
	go func() {
		cmd.Wait()
		done <- true
	}()
}

// Main function to parse the TOML file and run the validators
func main() {
	// Define command-line flags
	configFile := flag.String("config", "./tiny.toml", "Path to the TOML configuration file")
	delay := flag.Int64("delay", 12, "Delay to add to the current timestamp for TIMESTAMP")

	// Parse the command-line flags
	flag.Parse()

	// Load the configuration from the TOML file
	var config Config
	if _, err := toml.DecodeFile(*configFile, &config); err != nil {
		log.Fatalf("Error loading TOML file: %v", err)
	}

	// Print out the chain, V, C, E, P, Y parameters
	fmt.Printf("Chain: %s, V: %d, C: %d, E: %d, P: %d, Y: %d\n", config.Jamchain.Chain, config.Jamchain.V, config.Jamchain.C, config.Jamchain.E, config.Jamchain.P, config.Jamchain.Y)

	// Calculate the TIMESTAMP value using the delay
	timePlusDelay := time.Now().Unix() + *delay

	// Channel to listen for termination
	done := make(chan bool)
	sigChannel := make(chan os.Signal, 1)
	signal.Notify(sigChannel, os.Interrupt, syscall.SIGTERM)

	// Run each validator process
	for index, validator := range config.Validators {
		// Combine default args and validator command
		defaultArgs := strings.Join(config.Jamchain.DefaultArgs, " ")
		command := replacePlaceholders(validator.Command, defaultArgs, index, validator.Name, timePlusDelay)

		// Start the validator command
		go runValidator(index, validator.Name, command, done)
	}

	// Wait for kill signal
	select {
	case <-sigChannel:
		fmt.Println("\nShutting down validators...")
		for range config.Validators {
			done <- true
		}
	}
}

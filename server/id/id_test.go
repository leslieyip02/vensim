package id

import (
	"sync"
	"testing"
)

func TestNewShortId_Basic(t *testing.T) {
	id, err := NewShortId()
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(id) < 6 {
		t.Errorf("expected id length >= 6, got %d", len(id))
	}
}

func TestNewShortId_Unique(t *testing.T) {
	seen := make(map[string]bool)
	for i := 0; i < 1000; i++ {
		id, _ := NewShortId()
		if seen[id] {
			t.Errorf("duplicate id generated: %s", id)
		}
		seen[id] = true
	}
}

func TestNewShortId_Concurrent(t *testing.T) {
	ids := make(chan string, 1000)
	var wg sync.WaitGroup
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			id, _ := NewShortId()
			ids <- id
		}()
	}
	wg.Wait()
	close(ids)

	seen := make(map[string]bool)
	for id := range ids {
		if seen[id] {
			t.Errorf("duplicate id in concurrent calls: %s", id)
		}
		seen[id] = true
	}
}

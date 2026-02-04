package timeout

import (
	"testing"
	"time"
)

func waitOrFail(t *testing.T, ch <-chan struct{}, d time.Duration, msg string) {
	t.Helper()

	select {
	case <-ch:
		return
	case <-time.After(d):
		t.Fatal(msg)
	}
}

func ensureNotTriggered(t *testing.T, ch <-chan struct{}, d time.Duration, msg string) {
	t.Helper()

	select {
	case <-ch:
		t.Fatal(msg)
	case <-time.After(d):
		return
	}
}

func TestTimeoutManager_StartTriggersTimeout(t *testing.T) {
	triggered := make(chan struct{}, 1)

	timer := NewTimer(20*time.Millisecond, func() {
		triggered <- struct{}{}
	})

	timer.Start()

	waitOrFail(
		t,
		triggered,
		50*time.Millisecond,
		"timeout did not trigger",
	)
}

func TestTimeoutManager_ResetCancelsTimeout(t *testing.T) {
	triggered := make(chan struct{}, 1)

	timer := NewTimer(30*time.Millisecond, func() {
		triggered <- struct{}{}
	})

	timer.Start()
	time.Sleep(10 * time.Millisecond)
	timer.Reset()

	ensureNotTriggered(
		t,
		triggered,
		50*time.Millisecond,
		"timeout should have been cancelled",
	)
}

func TestTimeoutManager_ResetBeforeStartIsSafe(t *testing.T) {
	timer := NewTimer(10*time.Millisecond, func() {
		t.Fatal("onTimeout should not be called")
	})

	timer.Reset()
	time.Sleep(20 * time.Millisecond)
}

func TestTimeoutManager_StartTwice(t *testing.T) {
	triggered := make(chan struct{}, 1)

	timer := NewTimer(50*time.Millisecond, func() {
		triggered <- struct{}{}
	})

	timer.Start()
	time.Sleep(10 * time.Millisecond)
	timer.Start()

	waitOrFail(
		t,
		triggered,
		70*time.Millisecond,
		"timeout did not trigger after restart",
	)
}

package timeout

import "time"

type TimeoutManager struct {
	duration  time.Duration
	timer     *time.Timer
	onTimeout func()
}

func NewTimer(duration time.Duration, onTimeout func()) *TimeoutManager {
	return &TimeoutManager{
		duration:  duration,
		timer:     nil,
		onTimeout: onTimeout,
	}
}

func (t *TimeoutManager) Start() {
	t.Reset()
	t.timer = time.AfterFunc(t.duration, t.onTimeout)
}

func (t *TimeoutManager) Reset() {
	if t.timer != nil {
		t.timer.Stop()
	}
	t.timer = nil
}

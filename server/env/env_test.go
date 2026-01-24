package env

import (
	"os"
	"testing"
)

func TestGetOrDefault(t *testing.T) {
	const key = "TEST_ENV_STRING"
	os.Unsetenv(key)

	defaultVal := "default"
	got := GetOrDefault(key, defaultVal)
	if got != defaultVal {
		t.Errorf("want %q but got %q", defaultVal, got)
	}

	expected := "value"
	os.Setenv(key, expected)
	defer os.Unsetenv(key)

	got = GetOrDefault(key, defaultVal)
	if got != expected {
		t.Errorf("want %q but got %q", expected, got)
	}
}

func TestGetOrDefaultInt(t *testing.T) {
	const key = "TEST_ENV_INT"
	os.Unsetenv(key)

	defaultVal := 42
	got := GetOrDefaultInt(key, defaultVal)
	if got != defaultVal {
		t.Errorf("want %d but got %d", defaultVal, got)
	}

	os.Setenv(key, "123")
	defer os.Unsetenv(key)
	got = GetOrDefaultInt(key, defaultVal)
	if got != 123 {
		t.Errorf("want 123 but got %d", got)
	}

	os.Setenv(key, "abc")
	got = GetOrDefaultInt(key, defaultVal)
	if got != defaultVal {
		t.Errorf("want %d but got %d", defaultVal, got)
	}
}

func TestGetOrPanic(t *testing.T) {
	const key = "TEST_ENV_PANIC"
	os.Unsetenv(key)

	defer func() {
		if r := recover(); r == nil {
			t.Errorf("expected panic when env var not set")
		}
	}()
	_ = GetOrPanic(key)
}

func TestGetOrPanic_Set(t *testing.T) {
	const key = "TEST_ENV_PANIC_SET"
	expected := "ok"
	os.Setenv(key, expected)
	defer os.Unsetenv(key)

	got := GetOrPanic(key)
	if got != expected {
		t.Errorf("want %q but got %q", expected, got)
	}
}

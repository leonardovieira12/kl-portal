package main

import (
	"compress/gzip"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestCompressedState(t *testing.T) {
	for _, header := range []string{"gzip", "gzip;q=0"} {
		r := httptest.NewRequest("GET", "/api/state", nil)
		r.Header.Set("Accept-Encoding", header)
		w := httptest.NewRecorder()
		compressedState(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Cache-Control", "no-store")
			w.Write([]byte(`{"state":"ok"}`))
		})).ServeHTTP(w, r)
		if header == "gzip" {
			z, e := gzip.NewReader(w.Body)
			if e != nil {
				t.Fatal(e)
			}
			b, _ := io.ReadAll(z)
			z.Close()
			if !strings.Contains(string(b), "ok") {
				t.Fatal(string(b))
			}
		} else if w.Header().Get("Content-Encoding") != "" {
			t.Fatal("ignored opt-out")
		}
	}
}

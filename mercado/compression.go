package main

import (
	"compress/gzip"
	"net/http"
	"strconv"
	"strings"
)

type gzipResponse struct {
	http.ResponseWriter
	writer *gzip.Writer
}

func (w gzipResponse) Write(b []byte) (int, error) { return w.writer.Write(b) }
func acceptsGzip(header string) bool {
	for _, part := range strings.Split(header, ",") {
		bits := strings.Split(strings.TrimSpace(part), ";")
		if !strings.EqualFold(bits[0], "gzip") {
			continue
		}
		quality := 1.0
		for _, p := range bits[1:] {
			p = strings.TrimSpace(p)
			if strings.HasPrefix(p, "q=") {
				q, e := strconv.ParseFloat(strings.TrimPrefix(p, "q="), 64)
				if e != nil {
					quality = 0
				} else {
					quality = q
				}
			}
		}
		if quality > 0 {
			return true
		}
	}
	return false
}
func compressedState(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "GET" || r.URL.Path != "/api/state" {
			next.ServeHTTP(w, r)
			return
		}
		w.Header().Add("Vary", "Accept-Encoding")
		if !acceptsGzip(r.Header.Get("Accept-Encoding")) {
			next.ServeHTTP(w, r)
			return
		}
		w.Header().Set("Content-Encoding", "gzip")
		writer := gzip.NewWriter(w)
		defer writer.Close()
		next.ServeHTTP(gzipResponse{w, writer}, r)
	})
}

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	_ "net/http/pprof"
	"os"
	"runtime"
	"sync"

	"github.com/gorilla/websocket"
)

type State struct {
	MulticastPeers []*UserResponse
	Mux            sync.Mutex
}

const (
	buffer         = 1024
	multicastGroup = "224.0.0.248:5001"
)

var upgrader = websocket.Upgrader{}
var settings = &Settings{}
var server = &http.Server{Addr: ":3000", Handler: nil}
var updateUserConns = []*websocket.Conn{}
var recvMessageConns = []*websocket.Conn{}
var mainState = &State{}
var multicastConn = &net.UDPConn{}

func main() {
	ctx, _ := context.WithCancel(context.Background())

	//? Debug
	runtime.SetBlockProfileRate(1000000000)
	go func() {
		log.Println(http.ListenAndServe("0.0.0.0:6060", nil))
	}()
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	//? Load settings
	data, err := ioutil.ReadFile("settings.json")
	if err != nil {
		settings.File, err = os.Create("settings.json")
		if err != nil {
			log.Fatal(err)
		}
	}
	settings.File, err = os.OpenFile("settings.json", os.O_RDWR, 0755)
	if err != nil {
		log.Fatal(err)
	}

	settings.Defaults()
	fmt.Println(string(data))
	err = json.Unmarshal(data, settings)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(settings)

	//? Initialize state
	mainState.MulticastPeers = []*UserResponse{}

	if settings.InterfaceID != 1 {
		//? Setup Multicasting
		netInterface, err := net.InterfaceByIndex(settings.InterfaceID)
		if err != nil {
			log.Fatal(err)
		}

		grpAddr, err := net.ResolveUDPAddr("udp", multicastGroup)
		if err != nil {
			log.Fatal(err)
		}

		//? Start Multicast
		multicastConn, err = net.ListenMulticastUDP("udp4", netInterface, grpAddr)
		if err != nil {
			log.Fatal(err)
		}

		go serveMulticastUDP(ctx, grpAddr, mainState)
		go keepAlive(ctx, grpAddr)
		ping(append([]byte{0}, []byte(getHostname())...))
		defer ping(append([]byte{2}, []byte(getHostname())...))
	}

	//? Start frontend
	http.Handle("/", LimitHandler{http.FileServer(http.Dir("./build"))})
	http.HandleFunc("/sendFile", recvFile)
	http.HandleFunc("/resource", resource)
	http.HandleFunc("/updateUsers", updateUsers)
	http.HandleFunc("/recvMessage", recvMessage)
	server.ListenAndServe()
}

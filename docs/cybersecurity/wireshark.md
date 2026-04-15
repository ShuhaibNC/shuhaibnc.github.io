# Useful Advanced Wireshark Filters

- `ip.addr == 10.0.0.1` - Show all traffic with 10.0.0.1 as either source or destination  
- `ip.addr == 10.0.0.0/24` - Show all traffic to and from any address in 10.0.0.0/24  
- `ip.src == 10.0.0.1 && ip.dst == 10.0.0.2` - Show all traffic from 10.0.0.1 to 10.0.0.2  
- `!(ip.addr == 10.0.0.1)` - Exclude all traffic to or from 10.0.0.1  

- `icmp.type == 3` - Show ICMP "destination unreachable" packets  
- `tcp or udp` - Show TCP or UDP traffic  
- `tcp.port == 80` - Show TCP traffic with port 80  
- `tcp.srcport < 1000` - Show TCP traffic with source port range  
- `!(tcp or udp)` - Find non-TCP/UDP traffic (unusual protocols)  

- `http or dns` - Show all HTTP or DNS traffic  
- `tcp.flags.syn == 1` - Show TCP packets with SYN flag set  
- `tcp.flags == 0x012` - Show TCP packets with both SYN and ACK flags set  
- `tcp.analysis.retransmission` - Show all retransmitted TCP packets  

- `http.request.method == "GET"` - Show packets associated with HTTP GET  
- `http.response.code == 404` - Show packets associated with HTTP 404 response  
- `http.host == "www.test.com"` - Show HTTP traffic matching the Host header  

- `tls.handshake` - Show only TLS handshake packets  
- `tls.handshake.type == 1` - Show Client Hello packets during TLS handshake  

- `dhcp and ip.addr == 10.0.0.0/24` - Show DHCP traffic for 10.0.0.0/24 subnet  
- `dhcp.hw.mac_addr == 00:11:22:33:44:55` - Show DHCP packets for specific MAC address  

- `dns.qry.name contains "cnn.com"` - Show DNS queries containing "cnn.com"  
- `dns.resp.name contains "cnn.com"` - Show DNS responses containing "cnn.com"  
- `dns.qry.name matches "\.xyz$|\.club$"` - Show DNS queries ending with specific TLDs  

- `frame contains "keyword"` - Show all packets containing the word "keyword"  
- `frame.len > 1000` - Show all packets larger than 1000 bytes  

- `eth.addr == 00:11:22:33:44:55` - Show traffic to or from specified MAC address  
- `eth[0x47:2] == 01:80` - Match Ethernet frames with 2 bytes at offset 0x47  

- `!(arp or icmp or stp)` - Filter out background traffic (ARP, ICMP, STP)  
- `vlan.id == 100` - Show packets with VLAN ID 100  
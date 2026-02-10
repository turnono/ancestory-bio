import urllib.request
import urllib.parse
import json
import sys
import threading
import time

SERVER_ORIGIN = "https://muhandis-jepa-gzoqvax33q-uc.a.run.app"

def listen_and_predict():
    print(f"Connecting to {SERVER_ORIGIN}/sse...")
    req = urllib.request.Request(f"{SERVER_ORIGIN}/sse")
    # MCP usually expects some headers?
    
    session_id = None
    
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                line = line.decode('utf-8').strip()
                if not line:
                    continue
                
                print(f"Received: {line}")
                
                if line.startswith("event: endpoint"):
                    # Next line should be data: ...
                    pass
                elif line.startswith("data:"):
                    data = line[5:].strip()
                    # If it's the endpoint url
                    if data.startswith("/"):
                        # This is the relative path for the message endpoint
                        endpoint_path = data
                        print(f"Endpoint Path: {endpoint_path}")
                        
                        # Extract session_id just for logging (optional)
                        if "session_id=" in endpoint_path:
                            session_id = endpoint_path.split("session_id=")[1]
                            print(f"Session ID: {session_id}")
                        
                        full_post_url = f"{SERVER_ORIGIN}{endpoint_path}"
                        
                        # Now send the request in a separate thread
                        threading.Thread(target=send_request, args=(full_post_url,)).start()
                    else:
                        # Try to parse as JSON-RPC response
                        try:
                            # Sometimes data is just "OK" or similar, but for MCP it should be JSON
                            if data.startswith("{"):
                                msg = json.loads(data)
                                if "result" in msg:
                                    print("GOT RESULT:")
                                    print(json.dumps(msg["result"], indent=2))
                                    return
                                if "error" in msg:
                                    print("GOT ERROR:")
                                    print(json.dumps(msg["error"], indent=2))
                                    return
                        except Exception as e:
                            print(f"Error parsing json: {e}")

    except Exception as e:
        print(f"Connection failed: {e}")

def send_request(full_url):
    print(f"Sending request to {full_url}...")
    time.sleep(1) # Give it a sec
    
    # Tool list payload
    payload = {
        "jsonrpc": "2.0",
        "method": "tools/list",
        "id": 1
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(full_url, data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    
    try:
        with urllib.request.urlopen(req) as resp:
            print(f"POST Status: {resp.status}")
            print(f"POST Response: {resp.read().decode('utf-8')}")
    except Exception as e:
        print(f"POST failed: {e}")

if __name__ == "__main__":
    listen_and_predict()

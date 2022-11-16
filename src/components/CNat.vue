<template>
  <div>
    <el-button @click="checkNat">Check my nat type</el-button>
    <div class="logs">
      <div v-for="(session, index) in logs" :key="index" class="card-holder">
        <el-card shadow="hover">
          <div slot="header">
            <b>{{session.type}}</b>
          </div>
          <div>
            <div v-for="(ip, index) in session.addresses" :key="index">{{ip}}</div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "nat",
  data() {
    return {
      logs: [],
    }
  },
  methods: {
    parseCandidate(line) {
      var parts
      // Parse both variants.
      if (line.indexOf("a=candidate:") === 0) {
        parts = line.substring(12).split(" ")
      } else {
        parts = line.substring(10).split(" ")
      }

      var candidate = {
        foundation: parts[0],
        component: parts[1],
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7],
      }

      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case "raddr":
            candidate.relatedAddress = parts[i + 1]
            break
          case "rport":
            candidate.relatedPort = parseInt(parts[i + 1], 10)
            break
          case "tcptype":
            candidate.tcpType = parts[i + 1]
            break
          default:
            // Unknown extensions are silently ignored.
            break
        }
      }
      return candidate
    },
    newSession() {
      this.logs.push({
        addresses: [],
        type: "Probing",
      })
      return this.logs.length - 1
    },
    checkNat() {
      let candidates = {}
      let pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.miwifi.com" },
          { urls: "stun:stun.syncthing.net" },
        ],
      })
      let session = this.logs[this.newSession()]
      pc.createDataChannel("foo")
      pc.onicecandidate = (e) => {
        if (e.candidate && e.candidate.candidate.indexOf("srflx") !== -1) {
          let cand = this.parseCandidate(e.candidate.candidate)
          if (!candidates[cand.relatedPort]) candidates[cand.relatedPort] = []
          candidates[cand.relatedPort].push(cand.port)
          session.addresses.push(
            `${cand.ip}:${cand.port}`
          )
        } else if (!e.candidate) {
          if (Object.keys(candidates).length === 1) {
            let ports = candidates[Object.keys(candidates)[0]]
            session.type = ports.length === 1 ? "Normal nat" : "Symmetric nat"
          }
        }
      }
      pc.createOffer().then((offer) => pc.setLocalDescription(offer))
    },
  },
}
</script>

<style lang="less" scoped>
.logs {
  margin-top: 20px;
}
.card-holder {
  display: block;
  margin: 10px 10px 0 0;
  width: 300px;
  float: left;
}
</style>
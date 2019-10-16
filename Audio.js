/**
 * @class Audio
 *
 * Manages the audio stuff.
 */

class AudioModule {
    constructor(model) {
        this.model = model
        this.activeTodo = null
        this.synth = new Tone.Synth().set({
            "oscillator" : { "type" : 'triangle' },
            "filter" : { "type" : "highpass" },
            "envelope" : {
                "attack": 0.01,
                "decay": 0.01,
                "sustain": 0.75,
                "release": 3
            }
        }).toMaster()

        this.loop = new Tone.Loop(time => {
            //triggered every eighth note.
            // find the active todo and play those notes
            const note = this.activeTodo.pitchSet[Math.floor(Math.random() * this.activeTodo.pitchSet.length)]
            if (Math.random()*100 < this.activeTodo.percent ) {
                console.log(this.activeTodo.duration)
                this.synth.triggerAttackRelease(note, this.activeTodo.duration)
            }
        }, "8n").start(0)

    }

    setActiveTodo = () => {
        this.activeTodo = this.model.activeTodo
        // console.log('activeTodo', this.activeTodo)
    }

    changeAudio = () => {  // changeAudioPlayStatus
        // if nowPlaying is false, stop
        // console.log('nowPlaying', this.model.nowPlaying)
        if (this.model.nowPlaying === false) {
            this.stop()
        }
        else {
            this.setActiveTodo()
            // console.log(Tone.Transport.bpm.value)
            if (this.activeTodo.tempo != Tone.Transport.bpm.value) {
                Tone.Transport.bpm.value = this.activeTodo.tempo
            }
            this.start()
        }
        // now playing is a number,
        //  some setup may be required?
        //  start
    }

    start = () => {
        // console.log('start')
        Tone.Transport.start();
    }

    stop = () => {
        // console.log('stop')
        Tone.Transport.stop();
        this.synth.triggerRelease()
    }
}

class Model{
    constructor(){
        this.processAll = [];
        this.readyQueue = [];
        this.deviceQueue = [];
        this.time =0;
        this.intervalid = null;
        this.MEMORYSIZE = 2560;
        this.runningCPU = null;
        this.runningDevice= null;

    }
    pushReadyQueue(process){
        this.readyQueue.push(process);
        console.log(this.readyQueue);
        this.readyQueue.sort(function(a, b) {
            let numA = parseInt(a.processName.match(/\d+/)[0]);
            let numB = parseInt(b.processName.match(/\d+/)[0]);
            return numA - numB;
          });
          console.log(this.readyQueue);
    }
    updateTime(){
        this.time++;
    }
    processADD(process){
        this.processAll.push(process);
        this.readyQueue.push(process);
        this.findRunningProcess();
        this.startProcessTime();
        
    }
    deviceADD(){
        const findrunning = this.processAll.find((p)=>p.status === 'running');
        if(findrunning){
            this.deviceQueue.push(findrunning);
            findrunning.status = 'waiting';
            this.setRunningCPU(null);
            this.findRunningProcess();
            this.findRunningDevice();
            // console.log(findrunning);
        }
        // this.deviceQueue.push(process);

    }
    setRunningCPU(process){
        this.runningCPU = process;
    }
    getRunningCPU(){
        return this.runningCPU;
    }
    setRunningDevice(process){
        this.runningDevice = process;
    }
    getRunningDevice(){
        return this.runningDevice;
    }
    removeDevice(){
        let removedevice = this.deviceQueue.shift();
        if(removedevice){
            this.setRunningDevice(null);
            removedevice.status = 'ready';
            removedevice.statusIO = 'waiting';
            if(this.deviceQueue.length  > 0){
                this.deviceQueue[0].statusIO = "running";
                this.setRunningDevice(this.deviceQueue[0]);
            }
            this.pushReadyQueue(removedevice);
            this.findRunningProcess();
        }else{
            Swal.fire({
                title: "ไม่มีการใช้อุปกรณ์ I/O !!",
                text: "ไม่สามารถลบอุปกรณ์ I/O ได้",
                icon: "error"
              });
        }
        
    }
    getMemory(){
        let memory = 0;
        this.processAll.forEach((p)=>{
            memory += p.memory
        });
        return ((memory/this.MEMORYSIZE)*100).toFixed(2);
    }
    getProcessAll(){
        return this.processAll;
    }
    getReadyQueue(){
        return this.readyQueue; 
    }
    getDeviceQueue(){
        let deviceWaiting = this.deviceQueue.filter(p=>p.statusIO === 'waiting');
        return deviceWaiting; 
    }
    checkMomory(lastMem){
        let memUse = 0;
        this.processAll.forEach((p)=>{
            memUse += p.memory;
        });
       let currentMem = memUse+lastMem;
       if(currentMem<= this.MEMORYSIZE){
            return true;
       }else{
            return false;
       }
    }


    startProcessTime(){
        if(!this.intervalid){
            this.intervalid = setInterval(()=>{
                let process = this.processAll;
                process.forEach((p)=>{
                    if(p.status === 'running'){
                        p.burstTime++;
                    }else if(p.status === 'ready'){
                        p.waitingTime++
                    }else if(p.statusIO === 'running'){
                        p.ioTime++
                    }else if(p.statusIO === 'waiting'){
                        p.resPond++;
                    }
                });
            },1000);
        }
    }
    findRunningProcess(){
        let runningProcess = this.processAll.find(p=>p.status === 'running');
        if(runningProcess){
            this.readyQueue.forEach((p)=>{
                p.status= 'ready';
            });
        }else{
            const nextProcess = this.readyQueue.shift();
            if(nextProcess){
                nextProcess.status = 'running';
                this.setRunningCPU(nextProcess);
            }
        }
        
        
    }
    findRunningDevice(){
        let runningDevice = this.processAll.find(p=>p.statusIO === 'running');
        if(runningDevice){
            //notthing
        }else{
            const nextProcess = this.deviceQueue[0];
            if(nextProcess){
                nextProcess.statusIO = 'running';
                this.setRunningDevice(nextProcess);
            }
        }
       
    }
    terminate(){
        let runningProcess = this.processAll.find(p=>p.status === 'running');
        if(runningProcess){
            let index = this.processAll.findIndex(process => process === runningProcess);
            this.processAll.splice(index,1); //ลบ process ออก processAll
            runningProcess.status = 'terminate';
            this.setRunningCPU(null);
            this.findRunningProcess();
        }else{
            if(this.processAll.length > 0){
                Swal.fire({
                    title: "ไม่มี process ที่ใช้งาน CPU !!",
                    text: "ไม่สามารถ terminate ได้",
                    icon: "error"
                  });
            }else{
                Swal.fire({
                    title: "ไม่มี process ใน job queue !!",
                    text: "ไม่สามารถ terminate ได้",
                    icon: "error"
                  });
            }
        }
        return runningProcess;
    }
}
export default Model;
import Model from './Model.js';
import View from './View.js';

class Controller{
    constructor(model,view){
        this.model = model;
        this.view = view;
        this.startClock();
    }
    startClock(){
        setInterval(()=>{
            this.model.updateTime(); // time ++
            this.view.startClock(this.model.time)
            this.view.updatePCB(this.model.getProcessAll(),this.model.MEMORYSIZE);
            this.view.updateReadyQueue(this.model.getReadyQueue());
            this.view.updateDevice(this.model.deviceQueue);
            this.view.updateDeviceQueue(this.model.getDeviceQueue());
            this.view.updatecpuRunning(this.model.getRunningCPU());
            this.view.updateDeviceRunning(this.model.getRunningDevice());
        },1000);
    }   
    addProcess(processName){
        const process = {
            processName: processName,
            arrivalTime:this.model.time,
            burstTime:0,
            waitingTime:0,
            ioTime:0,
            resPond:0,
            memory:Math.floor(Math.random() * 512) + 1,
            status:'new',
            statusIO:'waiting'
        };
        if(this.model.checkMomory(process.memory)){
            console.log('เพิ่มได้');
            this.view.ADDPCB(process);
            this.model.processADD(process);
            this.view.updateMemory(this.model.getMemory());
            
        }else{
            Swal.fire({
                title: "Memory ไม่เพียงพอ !!",
                text: "ไม่สามารถเพิ่ม process ได้",
                icon: "error"
              });
        }
        
        
    }
    addDevice(){
      this.model.deviceADD();
      this.view.updateDevice(this.model.deviceQueue);
      
     
    }
    removeDevice(){
        this.model.removeDevice();
       
        
    }
    terminate(){
        let terminate = this.model.terminate();
        console.log(terminate);
        if(terminate){
            this.view.updateTerminateDisplay(terminate);
            this.view.updateMemory(this.model.getMemory());
            this.view.updateController();
           
        }
    }

}
const model = new Model();
const view = new View();
const myControl = new Controller(model,view);

// add process
const addProcessBtn = document.getElementById("addProcessBtn");
let count = 1;
addProcessBtn.addEventListener('click',()=>{
    myControl.addProcess('Process'+count);
    count++;
});
// add process

// add device
const addDeviceBtn = document.getElementById("addDeviceBtn");
addDeviceBtn.addEventListener('click',()=>{
    myControl.addDevice();
});
// add device

// remove device
const removeDeviceBtn = document.getElementById("removeDeviceBtn");
removeDeviceBtn.addEventListener('click',()=>{
    myControl.removeDevice();
});
// remove device

// remove terminate
const terminateBtn = document.getElementById("terminateBtn");
terminateBtn.addEventListener('click',()=>{
    myControl.terminate();
});
// remove terminate

// remove terminate
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener('click',()=>{
    Swal.fire({
        title: "ยืนยันรีเซตระบบ",
        text: "กรุณากด OK เพื่อยืนยัน",
        icon: "question",
        showCancelButton: true,
        showConfirmButton:true
      }).then((result)=>{
        if(result.isConfirmed){
            window.location.reload();
        }
      });
});
// remove terminate


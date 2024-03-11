class View{
    constructor(){
        this.clock = document.getElementById("clockTime");
        this.MemoryUse = document.getElementById("MemoryUse");
        this.tbodyPCB = document.getElementById("tbodyPCB");
        this.tbodyReadyQueue = document.getElementById("tbodyReadyQ");
        this.tbodydeviceQueue = document.getElementById("tbodydeviceQueue");
        this.tbodyDevice = document.getElementById("tbodyDevice");
        this.tbodyTerminate = document.getElementById("tbodyTerminate");
    }
    startClock(time){
        this.clock.innerHTML = "clock : "+time;
    }
    ADDPCB(process){
            let newTr = `
            <tr>
            <td>${process.processName}</td>
            <td>${process.arrivalTime}</td>
            <td>${process.burstTime}</td>
            <td>${process.waitingTime}</td>
            <td>${process.memory}</td>
            <td>${process.status}</td>
            </tr>
            `;
            this.tbodyPCB.insertAdjacentHTML('beforeend',newTr);
    
    }
    updateDevice(process){
        this.tbodyDevice.innerHTML = "";
        process.forEach((p)=>{
            let newTr = `
            <tr>
            <td>${p.processName}</td>
            <td>${p.ioTime}</td>
            <td>${p.resPond}</td>
            <td class="statusPCB">${p.statusIO}</td>
            </tr>
            `;
            this.tbodyDevice.insertAdjacentHTML('beforeend',newTr);
            
        });
        this.updatePCBcolor();
    
    }
    updateDeviceQueue(process){
        this.tbodydeviceQueue.innerHTML = '';
        process.forEach((p,i)=>{
            let newTr = `
            <tr>
            <td>${i+1}</td>
            <td>${p.processName}</td>
            <td>${p.arrivalTime}</td>
            </tr>
            `;
            this.tbodydeviceQueue.insertAdjacentHTML('beforeend',newTr);
        });

    }
    updatePCB(process,memorySize){
        this.tbodyPCB.innerHTML = "";
        process.forEach(p => {
            let newTr = `
            <tr>
            <td>${p.processName}</td>
            <td>${p.arrivalTime}</td>
            <td>${p.burstTime}</td>
            <td>${p.waitingTime}</td>
            <td>${p.memory}KB(${(p.memory/memorySize*100).toFixed(2)} %)</td>
            <td class="statusPCB">${p.status}</td>
            </tr>
            `;
            this.tbodyPCB.insertAdjacentHTML('beforeend',newTr);
            this.updatePCBcolor();
        });
    }
    updateMemory(memory){
        this.MemoryUse.innerHTML = "Memory Use : "+memory+" %";
    }
    updateReadyQueue(readyQueue){
        this.tbodyReadyQueue.innerHTML = "";
        readyQueue.forEach((p,i) => {
            let newTr = `
            <tr>
            <td>${i+1}</td>
            <td>${p.processName}</td>
            <td>${p.arrivalTime}</td>
            </tr>
            `;
            this.tbodyReadyQueue.insertAdjacentHTML('beforeend',newTr);
        });

    }
    updatePCBcolor(){
        const statusPCB = document.querySelectorAll(".statusPCB");
        // console.log(statusPCB);
        statusPCB.forEach((p)=>{
            if(p.innerHTML === 'running'){
                p.style.backgroundColor = "green";
            }else if(p.innerHTML === 'ready'){
                p.style.backgroundColor = "yellow";
            }else if(p.innerHTML === 'waiting'){
                p.style.backgroundColor = "coral";
            }else if(p.innerHTML === 'terminate'){
                p.style.backgroundColor = "red";
                p.style.color = 'white';
            }
        });
    }
    updateTerminateDisplay(process){
        let turnaround = (process.burstTime+process.waitingTime+process.ioTime+process.resPond);
        let newTr = `
        <tr class="trTerminate">
        <td>${process.processName}</td>
        <td>${process.arrivalTime}</td>
        <td>${process.burstTime}</td>
        <td>${process.waitingTime}</td>
        <td>${process.ioTime}</td>
        <td>${process.resPond}</td>
        <td>${turnaround}</td>
        <td class="statusPCB">${process.status}</td>
        </tr>
        `;
        this.tbodyTerminate.insertAdjacentHTML('beforeend',newTr);
    }
    updateController(){
        let trAll = document.querySelectorAll(".trTerminate");
        let sumBurst = 0;
        let sumWaiting = 0;
        let sumIO = 0;
        let sumResPond = 0;
        let sumTurnAround = 0;
        trAll.forEach((tr)=>{
            const tds = tr.querySelectorAll("td");
            const burstTime = tds[2].textContent;
            const waitingTime = tds[3].textContent;
            const ioTime = tds[4].textContent;
            const resPond = tds[5].textContent;
            const turnaroundTime = tds[6].textContent;
            sumBurst += parseInt(burstTime);
            sumWaiting += parseInt(waitingTime);
            sumIO += parseInt(ioTime);
            sumResPond += parseInt(resPond);
            sumTurnAround += parseInt(turnaroundTime);
        });
        sumBurst = (sumBurst/trAll.length).toFixed(2);
        sumWaiting = (sumWaiting/trAll.length).toFixed(2);
        sumIO = (sumIO/trAll.length).toFixed(2);
        sumResPond = (sumResPond/trAll.length).toFixed(2);
        sumTurnAround = (sumTurnAround/trAll.length).toFixed(2);
        document.getElementById("avgBurst").innerHTML = sumBurst;
        document.getElementById("avgWait").innerHTML = sumWaiting;
        document.getElementById("avgIO").innerHTML = sumIO;
        document.getElementById("avgRes").innerHTML = sumResPond;
        document.getElementById("avgTurn").innerHTML = sumTurnAround;
    }
    updatecpuRunning(process){
        if(process){
            document.getElementById("runningCPU").innerHTML = process.processName;
        }else{
            document.getElementById("runningCPU").innerHTML = "Null";
        }
        }
    updateDeviceRunning(process){
        if(process){
            document.getElementById("runningIO").innerHTML = process.processName;
        }else{
            document.getElementById("runningIO").innerHTML = "Null";
        }
    }


}
export default View;
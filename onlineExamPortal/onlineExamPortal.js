import { LightningElement, track } from 'lwc';
import getAllQuestion from '@salesforce/apex/AccountController.getAllQuestion';

export default class OnlineExamPortal extends LightningElement {
    records;
    data=[];
    showTimer=false;
    start=false;
    correct=[];
    completeRecord;
    score=0;
    selected;
    timeLeft = 60; // set the initial time in seconds
   i=0;
   questionFormat=[];

   proceed=false;
  
  @track  timeVal='05:00';
   show;
   timeIntervalInstance;
   started=true;

   review=false;

   result=false;
   studentName='';
  pbtn=false;
  nbtn=true;
  total;
  percentage;
  pf;
  check;
  mlabel='Mark Review ';
  showA=false;
 showMark=true;
  handleCheckbox(event){
    this.check=event.target.checked;
    console.log('checkbox'+event.target.checked);
  }

  handleProceed(){
    if(this.studentName==''){
      alert("Please enter the name");
    }
    
    
    
    else{
      this.proceed=true;
      this.started=false;
    }
  }

   handleChange(event){
    this.studentName=event.target.value;
   }
    

    handleStart(e){
      
      

      if(this.check){
        this.proceed=false;
        
        //console.log('start')
        getAllQuestion()
        .then(result=>{
          //console.log('total check'+result.length);
          this.total=result.length;
            this.records=JSON.parse(JSON.stringify(result));
            this.completeRecord=this.records;
            //console.log('record',this.records); 
            this.fetchadata();         
        });
        
        
         // console.log('complete'+this.completeRecord);
         this.reverserTimer();
          
        this.start=true;
        
        this.showTimer=true;

        }
        else{
          alert('Please accept the terme and conditions');
        }
         
        
    }
    
    
    


        fetchadata(){
            this.questionFormat.push(
              {
                    "options":this.records[this.i].options,
                    "question":this.records[this.i].question,
                    "selectedAnswer":this.records[this.i].selectedAnswer,
                    "qNo":this.records[this.i].qNo,
                    "marked":this.records[this.i].marked
                    

              }
             )    

             console.log('kjhudfhv'+JSON.stringify( this.questionFormat));
            
             this.questionFormat[this.i].options.forEach(element => {  
                element.selectedvalue=false;
            //   if(element.value == this.records[this.i].selectedAnswer){
            //     element.selectedvalue = true;
            //   }
            //   else{
            //     element.selectedvalue=false;
            // 
              
             });

             //console.log("checked marked"+JSON.stringify(this.questionFormat));
             
             
             //console.log('component list'+JSON.stringify(this.questionFormat));
          }


           

       
        
        
        reverserTimer(){
        this.interval = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft === 0) {
              clearInterval(this.interval);
              // do something when the timer reaches 0
            }
          }, 1000);
          //console.log('query',this.template.querySelector('lightning-input'));
          setTimeout(()=>{
            clearInterval(this.timeIntervalInstance );
            this.final();
          },300000);
        
        console.log('Start');
        this.showStartBtn = false;
        var parentThis = this;
        const endTime = new Date().getTime() + 300000; // 5 minutes in milliseconds
        // Run timer code in every 1000 milliseconds
        this.timeIntervalInstance = setInterval(function() {
            const now = new Date().getTime();
            const timeDifference = endTime - now;
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            // Output the result in the timeVal variable
            parentThis.timeVal = `${minutes.toString().padStart(0, '0')}:${seconds.toString().padStart(0, '0')}`;   
            
        }, 1000);
        
    }
    
    HandleClick(event){
      let valueOfquestion = event.target.value;
      let selectedid = event.target.dataset.id;
      console.log('value selected--'+valueOfquestion+'  id-- '+selectedid);
      
      for(let i=0;i<this.records.length;i++){
        console.log('loop started');
        if(this.records[i].question.Id==selectedid){
          this.records[i].selectedAnswer=valueOfquestion;
          console.log("selectedanswer --"+this.records[i].selectedAnswer);
         
          if(this.records[i].question.Answer__c== valueOfquestion){
            console.log('matched');
            this.score+=1;
            this.records[this.i].options.forEach(element=>{
              if(element.value==valueOfquestion){
                element.marked=true;
              }
              else{
                element.marked=false;
              }
            })

            if(!this.data.includes(this.records[i].question.qNo)){
              this.data.push(this.records[i].question.qNo);
            }
            console.log('inside-score'+this.records[i].question.qNo);
            console.log('inside-records'+this.records.length);
          }
         
          else{
            console.log("unmatched");
            if(this.data.includes(this.records[i].question.qNo)){
              this.data.pop(this.records[i].question.qNo);
              this.score--;
            }
          }

        }
      }
      this.records[this.i].options.forEach(element => {
          if(element.value==event.target.value){
            element.selectedvalue=true;
          }
          else{
            element.selectedvalue=false;
          }
          console.log('check'+JSON.stringify(this.records[this.i]));
      });
     
      console.log('hgg'+JSON.stringify(this.records[this.i].options));
      this.confirmation();
      this.questionFormat.pop();
      this.fetchadata();
      console.log('score'+this.data.length);
    }

    handleSubmit(){
      console.log('last'+JSON.stringify(this.records));
        this.review=true;
        this.start=false;

        
        
        // alert(this.score);
    }

    handleNext(){
        //console.log('check'+this.arr[this.i]);
        
      
          
            this.questionFormat.pop();
            this.i++;
            console.log('i',this.i);
            console.log('total'+this.total);
            if(this.i>0){
              this.pbtn=true;
            }
            if(this.i==this.records.length-1){
              this.nbtn=false;
          }
            this.fetchadata();
            
        
        //console.log('i',this.i);
        //console.log('unchange'+this.data);
        
           
              
           
           
        
        
        
    }

    handlePev(){
        
        
        
          
          
            this.questionFormat.pop();
            this.i--;
            console.log('p',this.i);
            if(this.i<this.records.length-1){
              this.nbtn=true;
            }
            if(this.i==0){
              this.pbtn=false;
          }
            this.fetchadata();
            
        
        
    }

    back(){
        this.review=false;
        this.start=true;
    }

    final(){
        this.review=false;
        this.start=false;
        this.result=true;
        this.showTimer=false;
        this.percentage = (this.score / this.total) * 100;
        if(this.percentage>30){
          this.pf="PASS";
        }
        else{
          this.pf="FAIL";
        }

    }
    Answered;
    unAnswered;
    
    confirmation(){
        this.reviewPanel=true;
        this.ShowQuestion=false;
        this.Answered=0;
        this.unAnswered=0;
        let buttons = this.querySelectorAll('[data-id="adobeSignBtn"]');
        console.log('buttons'+buttons);
        
       
        if(this.records[this.i].selectedAnswer!=''){
          this.records[this.i].buttonVariant='success';
          console.log('this.completeRecord[i].buttonVariant'+this.records[this.i].buttonVariant);
        }
        else{
          this.records[this.i].buttonVariant='neutral';
          console.log('this.CompleteData[i].buttonVariant'+this.records[this.i].buttonVariant);
        }
       
        this.records.forEach(element =>{
          if(element.selectedAnswer!=''){
            this.Answered+=1;
  
          }else{
            this.unAnswered+=1;
          }
        });
      }

      handleReviewBtnClick(event){
        let index= event.target.label-1;
        this.i=index;
        if(this.i==0){
          this.pbtn=false;
          this.nbtn=true;
        }
        if(this.i==this.records.length-1){
          this.pbtn=true;
          this.nbtn=false;
        }

        if(this.i>0 && this.i<this.records.length-1){
          this.pbtn=true;
          this.nbtn=true;
        }
        console.log("event-target-of-review-btn "+event.target.label);
        console.log("event-target-of-review-btn "+event.target.dataset.id);
        this.questionFormat.pop();
        this.questionFormat.push(this.records[index]);
        this.start=true;
        this.review=false;
        console.log('this.questionFormat',JSON.parse(JSON.stringify(this.questionFormat)));
        }

      marked(event){
        // console.log('m'+event.target.dataset.Id);
        
        if(this.records[this.i].marked_button){
          console.log('#####');
          this.records[this.i].marked_button=false;
          
          this.records[this.i].buttonVariant='destructive';
          
        }
        this.handleNext();
       
      }

      showAnswer(){
        this.showA=true;


      }

}
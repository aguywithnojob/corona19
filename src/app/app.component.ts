import { Component,OnInit } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'corona19';
  URL = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/";
  key = "502b39f8bfmsh15ce602ed9cfbddp1b2064jsn917db9f6f259";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json',
      'X-RapidAPI-Key': this.key
    })
  }
  stat:any;
  total_stat={
    active: '',
    confirmed: '',
    deaths: '',
    lastupdatedtime: '',
    recovered: ''
    
  };
  statewise_stat = [];
  headline=[];
  submitted = false;
  country_stat={
    name:'',total_cases:'',total_deaths:'',total_recovered:'',active_cases:'',serious_critical:''
  };
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = []; //statename
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData = [
    {data: [], label: 'confirmed'},
    {data: [], label: 'active'},
    {data: [], label: 'deaths'},

  ];

  

  constructor(private _http: HttpClient){}

  ngOnInit(){
    this.get_stats_india()
    this.get_top_headline() 
  }

  get_stats_india(){
   this._http.get('https://api.covid19india.org/data.json')
   .subscribe(data=>{
   
     this.stat = data;
    let item_Arry = this.stat.statewise;
    

    item_Arry.forEach((item,index) => {
        // console.log(item,index)
        if(index == 0){
          this.total_stat.active = item.active;
          this.total_stat.confirmed = item.confirmed;
          this.total_stat.recovered = item.recovered;
          this.total_stat.deaths = item.deaths;
          this.total_stat.lastupdatedtime = item.lastupdatedtime;
          
        }
        else{
          this.statewise_stat.push(item)
        }
    });
    this.get_graph()
   },err=>{console.log('err',err)}) 
  }


   

  get_graph(){
    // console.log(this.statewise_stat)
    this.statewise_stat.forEach(item=>{
      if(item.active != '0' && item.confirmed != '0'){
        this.barChartLabels.push(item.state);
      this.barChartData[0].data.push(parseInt(item.confirmed));
      this.barChartData[1].data.push(parseInt(item.active));
      this.barChartData[2].data.push(parseInt(item.deaths));
      }
      
    })
  }


  get_top_headline(){
    this._http.get('http://newsapi.org/v2/top-headlines?q=corona&country=in&apiKey=79ae714b41d2438383ef83d4da1e51fe')
    .subscribe(res=>{
      // console.log(res['articles']);
      res['articles'].forEach((item,index) => {
         if(index <= 4){
          this.headline.push(item)
         } 
          
      });
      // console.log(this.headline)
    },err=>{
      console.log('error',err)
    })
  }

  search_stat_country(userForm:NgForm){
    // console.log(userForm)
    this.country_stat={
      name:'',total_cases:'',total_deaths:'',total_recovered:'',active_cases:'',serious_critical:''
    };
    let name = userForm['country'];
    // console.log(name)
    this._http.get(this.URL+"latest_stat_by_country.php?country="+name,this.httpOptions).subscribe(res=>{
      this.submitted = true;
      // console.log(res['latest_stat_by_country'])
      let tmp = res['latest_stat_by_country'];
      // console.log(tmp[0].country_name)
      if(tmp[0].country_name === ''){
        this.submitted = false;
      }
      if(tmp[0].country_name == 'India'){
        // console.log('yea')
        this.country_stat.name = tmp[0].country_name;
        this.country_stat.total_cases = this.total_stat.confirmed;
        this.country_stat.active_cases = this.total_stat.active;
        this.country_stat.total_deaths = this.total_stat.deaths;
        this.country_stat.total_recovered = this.total_stat.recovered;
      }
      else{
        this.country_stat.name = tmp[0].country_name;
      this.country_stat.total_cases = tmp[0].total_cases;
      this.country_stat.active_cases = tmp[0].active_cases;
      this.country_stat.total_deaths = tmp[0].total_deaths;
      this.country_stat.total_recovered = tmp[0].total_recovered;
      }
      
      // console.log(this.country_stat)
    },
    err=>{
      this.submitted= false;
    })
  }
  

}

;
("use strict");
(async function (e) {
  "use strict";
  document.querySelector("html").addEventListener("keypress", (e) => {
    if (e.key === "Enter" &&document.querySelector("#searchTerm").style.display!="none") {
      e.preventDefault();
      document.querySelector("#doSearch").click();
    }
  });

  document.querySelector("#structures").addEventListener("change",e=>{
    e.stopImmediatePropagation;
    e.preventDefault();
    e.stopPropagation();
    let p=document.querySelector("#searchTerm"),y=document.querySelector("#structures");
    p.value=y[y.selectedIndex].value;
    y.style.display="none";p.style.display="block";
    let x=document.querySelector("#doSearch");x.click();
  });
  let vProp = new DocumentFragment();
  let vPropCycles = new DocumentFragment();
  const data = await d3.csv(
    "https://raw.githubusercontent.com/NYCDOB/ParkingStructures/gh-pages/data/ParkingStructureInspections.csv",
    (d) => {
      if (d["Report Status"]=="Accepted"  && d["Status"]=="Active") {
      d.Address=`${d["House  Number"]} ${d["Street Name"]}`;
      return d;
      }
    }
  );
  document.querySelector(".getIt").addEventListener("click",(e)=>{
    let _m=[]; 
    let cols=["Parking Structure ID","Filing Name","Filing Status","House  Number","Street Name","BIN","Block","Lot","Borough","C.B. No.","QPSI","Filing Type","UNSAFE / SREM Completion Date","Effective Filing Date","PIPS Cycle","PIPS Sub-Cycle","DOF Bldg Classification Description","City Owned","Report Status","ActiveStructuralPermit","FISP","LAT","LONG"]
    _m.push(cols);
    let getDString=()=>{
      let _d=new Date();
      return _d.getFullYear().toString()+("0"+(_d.getMonth()+1)).slice(-2)+("0"+(_d.getDate())).slice(-2);}
    data.forEach(   e => {
          let theline="";
          for (let _i of Object.keys(e) ) {
                if (cols.indexOf(_i)>=0  ){
                  let _w=(e[_i].indexOf(',')>=0||_i=="DOF Bldg Classification Description"?'"':'');
                  theline+=_w+e[_i]+_w+",";}}
          _m.push(theline);
          theline="";
    });
    let filename="ParkingStructureInspections_"+getDString()+".csv";
    let filetype="text/plain";
    let a=document.getElementById("_1a");let file = new Blob([_m.join("\n")],{type:filetype});a.href = URL.createObjectURL(file);
    a.download=filename;a.click()
  });
  function buildCard(e) {
    function fMakeEl(theval, thediv, theclass) {
      let vDivEl = document.createElement("div");
      vDivEl.innerText = theval;
      vDivEl.className = theclass;
      thediv.appendChild(vDivEl);
    }
    function getvVals(xR,vVals=[]) {
let orgarray = ["PIPS Sub-Cycle","Filing Name","Filing Status","Effective Filing Date","QPSI","Filing Type","Owner Name","UNSAFE / SREM Completion Date","FISP"];
      orgarray.forEach((x) => {
        if (x == "UNSAFE / SREM Completion Date") {
          if (xR["Filing Status"].toLowerCase() == "unsafe"  || xR["Filing Status"].toLowerCase()=="srem" ) {
            vVals.push(x);
          }
        } else {
            vVals.push(x)
          }
      });
      return vVals;
    }
    let _A = document.createElement("p");
    _A.innerText = e[0]["Address"];
    let _H = document.createElement("h3");
    _H.class = "col-xl-1";
    _H.appendChild(_A);
    vProp.appendChild(_H);
    let vVals = {"Parking Structure ID":"","BIN":"","Borough":"", "Block":"","Lot":"","C.B. No.":"CD","DOF Bldg Classification Description":"Building Class","City Owned":"","ActiveStructuralPermit":"Active Permit"};
    let ndx=0;
    for (let _x in vVals) {
        window["_Div" + ndx] = document.createElement("div");
        window["_Div" + ndx].className = "detailDiv row";
        fMakeEl(`${vVals[_x] || _x}:`, window["_Div" + ndx], "col-4");
        fMakeEl(`${e[0][_x]}`, window["_Div" + ndx], "col");
        vProp.appendChild(window["_Div" + ndx]);
        ndx++
    }
    let _hr = document.createElement("hr");
    _hr.className = "col-lg-1 d-lg-inline";
    vProp.appendChild(_hr);
    let ctr = 0;
    for (let dR of e) {
      let vVals = getvVals(dR);
      vVals.forEach((colName, ndx) => {
        window["_Div" + ndx] = document.createElement("div");
        window["_Div" + ndx].className = "zzz row";
        fMakeEl(
          `${colName}:`,
          window["_Div" + ndx],
          ndx == 0 ? "col-3 boldit" : "col-3"
        );
        fMakeEl(
          `${e[ctr][colName]}`,
          window["_Div" + ndx],
          ndx == 0 ? "col-3 boldit" : "col-3"
        );
        vPropCycles.appendChild(window["_Div" + ndx]);
      });
      vPropCycles.appendChild(document.createElement("br"));
      ctr++;
    }
    document.querySelector("#propertyData").textContent = "";
    document.querySelector("#propertyData").appendChild(vProp);
    document.querySelector("#structureDataDetail").textContent = "";
    document.querySelector("#structureDataDetail").appendChild(vPropCycles);
  }
  document.querySelector("#doSearch").addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    let searchTerm = document
      .querySelector("#searchTerm")
      .value.toLowerCase()
      .trim();
    if (!searchTerm) return;
    document.querySelector("#propertyData").innerText = "";
    let vBoro;
    document.querySelectorAll("[name='borough']").forEach((e) => {
      if (e.checked) {
        vBoro = e.value;
      }
    });
    let _t = data.filter((e) => {
      return (
        searchTerm == e["BIN"] ||searchTerm == e["Parking Structure ID"].trim().toLowerCase() ||(searchTerm == e["Address"].toLowerCase().trim() &&
          e["Borough"].toLowerCase()==vBoro)
      );
    });
    if (_t.length == 0) {
      document.querySelector("#propertyData").innerText =
        "Search Results...Parking Structure Not Found";
      document.querySelector("#structureDataDetail").innerText = "";
      return;
    } else 
    if (_t.length > 1) {
        let _c=document.querySelector("#structures");
        let marr = new Map();
        _t.forEach((xx) =>{ marr.set( xx["Parking Structure ID"],`${xx["House  Number"]} ${xx["Street Name"]} (${xx["Borough"]}),\tPSID: ${xx["Parking Structure ID"]}` )})
        if (marr.size ==1 ){ 
          _t.sort((x, z) => {
            return x["PIPS Cycle"] < z["PIPS Cycle"] ? 1 : -1;
          });
          document.querySelector("#structures").innerHTML = '<option value="">Multiple Parking Structures Found - Please Select</option>';
          buildCard(_t);
          return;
        }
        for (let _j of marr.entries()) { 
          let _a = document.createElement("option");
          _a.value=`${_j[0]}`;
          _a.textContent=`${_j[1]}`
          _c.appendChild(_a);
        }
        document.querySelector(".structureDataDetail").innerText=""
        document.querySelector("#searchTerm").style.display="none";
        document.querySelector("#structures").style.display="block";
        return;
    }
    else {
    _t.sort((x, z) => {
      return x["PIPS Cycle"] < z["PIPS Cycle"] ? 1 : -1;
    });
    document.querySelector("#structures").innerHTML = '<option value="">Multiple Parking Structures Found - Please Select</option>';
    buildCard(_t);
  }
  });
  (function () {
    let t=parseInt(window.location.href.split('?')[1]);history.pushState(null,"",window.location.href.split('?')[0]);
    if (t>0) {
      let d=document.querySelector("#searchTerm");
      d.value=t;d.setAttribute("value", t);let x=document.querySelector("#doSearch");x.click();
    }
  })();
})();
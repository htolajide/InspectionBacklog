import axios from 'axios';
const readXlsxFile = require('read-excel-file/node');
const fs = require("fs")
const path = require("path")
const FormData = require('form-data');

// Declaration of request url
const LOCAL_HOST = "http://localhost:8080";
const REMOTE_HOST = "https://african-buffalo.claritae.net";
const POST_URL = REMOTE_HOST + "/api/inspections";
const STATUS_URL = REMOTE_HOST + "/api/inspections/statuses";
const INSPECTOR_URL =  REMOTE_HOST + "/api/persons?role=Inspector";

exports.upload = (req, res) => {
	//const csvData = [];
	let statuses = {};
	let inspectors = {};
	let inspectionDate = '';
	let truckPlate = '';
	let status = '';
	let description = '';
	let inspector = '';
	let statusId = 0;
	let inspectorId = 0;
	let date = [];
	let year = '';
	let month = '';
	let day = '';
	let resources = [];
	try {
		// Make a request for a user with a given ID
		axios.get(STATUS_URL)
			.then(function (response) {
			statuses = response.data.items;
			// Make a request for a user with a given ID
			axios.get(INSPECTOR_URL)
				.then(function (response) {
					// handle success
					inspectors = response.data.persons;
					const excelFile = req.file.path;
					let number = req.body.number;
				console.log(number);
				console.log("File is: ", req.file)
				// open uploaded file
				readXlsxFile(excelFile).then((rows) => {
					// `rows` is an array of rows
					let createdInspections = 0;
					let responseData = {};
					let failedInspection = 0;
					let rowCount = 0;
					for (let i=1; i< rows.length; i++) {
						if (rows[i][1] == null) {
							break;
						}
						else {
								rowCount += 1;
								if (rowCount == number) {
									inspectionDate = rows[i][1].toISOString();
									date = inspectionDate.split("T")[0];
									year = date.split("-")[0];
									month = date.split("-")[1];
									day = date.split("-")[2];
									truckPlate = rows[i][2];
									status = rows[i][5];
									description = rows[i][6];
									inspector = rows[i][8];
									for (let stat of statuses) {
										if (stat.name == status) {
											statusId = stat.id;
											break;
										}
									}
									for (let insp of inspectors) {
										if (insp.fullname == inspector) {
											inspectorId = insp.personId;
											break;
										}
									}
									let resourceFolder = "./inspection-images/" + year + month + day + "/" + truckPlate;
									resources = getAllFiles(resourceFolder);
									if (resources.length == 0) {
										console.log("Resources not found for truck {} for inspection on {}", truckPlate, date);
									}
									console.log(rows[i]);
									console.log(resources);
									const formData = new FormData({ maxDataSize: 20971520 });
									for (let resource of resources) {
										formData.append("resourceFiles", fs.createReadStream(resource));
									}
									formData.append("truckPlate", truckPlate);
									formData.append("statusId", statusId);
									formData.append("description", description);
									formData.append("inspectionDate", inspectionDate);
									formData.append("inspectorId", inspectorId);
									formData.append("latitude", 0.0);
									formData.append("longitude", 0.0);
									formData.append("clientTimestamp", "2022-07-25T10:24:07.735Z");
									formData.append("clientId", "ABFInspectionClient");
									const postOptions = {
										url: POST_URL,
										method: 'post',
										data: formData,
										headers: {
											'Content-Type': 'multipart/form-data'
										}
									} 
									// post new data to stock, this will throw error if item already exists
									console.log("Creating inspections....")
									axios.request(postOptions).then( 
										feedback => {
											responseData = feedback.data;
											createdInspections += 1;
											console.log(createdInspections + " inspections created");
											fs.unlinkSync(excelFile); 
											// each row being an array of cells.
											res.jsend.success({ rowcount: "You are " + rowCount + " of " + rows.length + " records ", createdInspections: createdInspections, response: responseData })
										}
									).catch(error => {
										failedInspection += 1;
										console.log("InspectionError:" + error + " " + failedInspection + " inspection failed");
										// console.log( "The response is {}", res);
										res.jsend.error("InspectionError:" + error + " " + failedInspection + " inspection failed");
									});
									break;
								} else if (number >= rows.length) {
									res.jsend.error("Row number " + number + " is not valid (does not exist).");
									break;
								}
							}
						}
					})
				})
				.catch(function (error) {
					// handle inspectors error
					console.log(error);
				})
				
			})
		.catch(function (error) {
			// handle statuses error
			console.log(error);
		});
		// res.jsend.success({ rowcount: "There are " + rowCount + " records ", statuses : statuses, inspectors: inspectors, createdInspections: createdInspections, resources: resources, response: responseData });
	}catch(error) {
	  res.jsend.error({message: error.message})
	}
  };

  const getAllFiles = function(dirPath, arrayOfFiles) {
	// read folder and tell which does not exist.
	const folderName = './testFolder';
	let files = fs.readdirSync(dirPath);
	let arrayOfMyFiles = arrayOfFiles || [];
	try {
		if (fs.existsSync(dirPath)) {
			// fs.mkdirSync(folderName);
			files.forEach(function(file) {
				if (fs.statSync(dirPath + "/" + file).isDirectory()) {
				  arrayOfMyFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
				} else {
				  arrayOfMyFiles.push(path.join(__dirname, dirPath, "/", file))
				}
			  })
		} else {
			let content = dirPath + " Does not exits\n";
			example(content);
		}
	} catch (err) {
	console.error(err);
	}
	return arrayOfMyFiles
  }

  async function example(content) {
	try {
	  const content = 'Some content!';
	  await fs.writeFile('/Users/joe/test.txt', content);
	} catch (err) {
	  console.log(err);
	}
  }
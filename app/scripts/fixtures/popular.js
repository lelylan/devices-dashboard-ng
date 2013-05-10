'use strict';

var popularTypes =
[{
	"id": "518be107ef539711af000001",
	"uri": "http://api.lelylan.com/types/518be107ef539711af000001",
	"name": "Basic Light",
	"categories": ["lights"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define the most basic light structure giving you **turn on** and **turn off**  functionalities. <br> \nUse it to experimeting the communication between Lelylan and the pysical world.",
	"created_at": "2013-05-09T17:46:47Z",
	"updated_at": "2013-05-10T07:13:55Z"
}, {
	"id": "518be84900045e1521000007",
	"uri": "http://api.lelylan.com/types/518be84900045e1521000007",
	"name": "Light",
	"categories": ["lights"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete light structure.<br> It gives you **set intensity**, **set color** and **blinking** functionalities.",
	"created_at": "2013-05-09T18:17:45Z",
	"updated_at": "2013-05-10T07:16:16Z"
}, {
	"id": "518c9c07a2c03f2389000001",
	"uri": "http://api.lelylan.com/types/518c9c07a2c03f2389000001",
	"name": "Lock",
	"categories": ["locks", "windows"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete lock structure that can be used for your doors or windows.<br>\nIt gives you **open** and **close** functionalities.",
	"created_at": "2013-05-10T07:04:39Z",
	"updated_at": "2013-05-10T08:54:02Z"
}, {
	"id": "518c9e90a2c03f2389000006",
	"uri": "http://api.lelylan.com/types/518c9e90a2c03f2389000006",
	"name": "Thermostat",
	"categories": ["thermostats"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete thermostat structure.<br> It gives you **warming/cooling**, **temperature** and **speed** functionalities.",
	"created_at": "2013-05-10T07:15:28Z",
	"updated_at": "2013-05-10T07:28:41Z"
}, {
	"id": "518ca451a2c03fac5a000013",
	"uri": "http://api.lelylan.com/types/518ca451a2c03fac5a000013",
	"name": "IP Camera",
	"categories": ["cameras"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete IP Camera structure.<br> \nIt gives you **snapshot**, **rotation**,  **zoom** and **light** functionalities.",
	"created_at": "2013-05-10T07:40:01Z",
	"updated_at": "2013-05-10T07:50:11Z"
}, {
	"id": "518ca765a2c03fac5a00001f",
	"uri": "http://api.lelylan.com/types/518ca765a2c03fac5a00001f",
	"name": "Alarm System",
	"categories": ["alarms"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete alarm system structure.<br> \nIt gives you **activation** and **deactivation** functionalities.",
	"created_at": "2013-05-10T07:53:09Z",
	"updated_at": "2013-05-10T07:57:30Z"
}, {
	"id": "518cb15ea2c03f238900002d",
	"uri": "http://api.lelylan.com/types/518cb15ea2c03f238900002d",
	"name": "Meter",
	"categories": ["meters"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete meter structure.<br>\nIt gives you the ability to store **cumulative** and **instantaneous** energy consumptions.",
	"created_at": "2013-05-10T08:35:42Z",
	"updated_at": "2013-05-10T08:41:01Z"
}, {
	"id": "518ca248a2c03fac5a00000b",
	"uri": "http://api.lelylan.com/types/518ca248a2c03fac5a00000b",
	"name": "Alarm Clock",
	"categories": ["alarms"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete alarm clock structure.<br>\nIt gives you **alarm**, **repetition** and **duration** functionalities.",
	"created_at": "2013-05-10T07:31:20Z",
	"updated_at": "2013-05-10T08:46:05Z"
}, {
	"id": "518cb3c3a2c03f2389000033",
	"uri": "http://api.lelylan.com/types/518cb3c3a2c03f2389000033",
	"name": "Roller Shutter",
	"categories": ["windows"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete roller shutter structure.<br>\nIt gives you **open**, **close** and **stop** functionalities.",
	"created_at": "2013-05-10T08:45:55Z",
	"updated_at": "2013-05-10T08:53:51Z"
}, {
	"id": "518cb788a2c03f238900003c",
	"uri": "http://api.lelylan.com/types/518cb788a2c03f238900003c",
	"name": "Kettle",
	"categories": ["appliances"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete kettle structure.<br>\nIt gives you **warm water** functionality.",
	"created_at": "2013-05-10T09:02:00Z",
	"updated_at": "2013-05-10T09:06:33Z"
}, {
	"id": "518cb696a2c03fac5a00002e",
	"uri": "http://api.lelylan.com/types/518cb696a2c03fac5a00002e",
	"name": "Sprinkler System",
	"categories": ["gardenings"],
	"owner": {
		"id": "5036227a4f1b030200000001",
		"uri": "http://api.lelylan.com/people/5036227a4f1b030200000001"
	},
	"description": "Define a complete sprinkler system structure.<br>\nIt gives you **activate**, **deactivate** and **water aperture** functionalities.",
	"created_at": "2013-05-10T08:57:58Z",
	"updated_at": "2013-05-10T09:01:01Z"
}]

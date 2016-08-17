//
//  Event.swift
//  Twinder
//
//  Created by Jérémy Peltier on 22/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

class Event: NSObject {

	var name: String!
	var desc: String!
	var date: NSDate!
	var points: NSInteger!
	var place: String?
	
	override init() {
		super.init()
	}
	
	init(name: String, desc: String, date: NSDate, points: NSInteger, place: String) {
		super.init()
		self.name = name
		self.desc = desc
		self.date = date
		self.points = points
		self.place = place
	}
	
	required init(coder aDecoder: NSCoder) {
		
		if let name = aDecoder.decodeObjectForKey("name") as? String {
			self.name = name
		}
		
		if let desc = aDecoder.decodeObjectForKey("desc") as? String {
			self.desc = desc
		}
		
		if let date = aDecoder.decodeObjectForKey("date") as? NSDate {
			self.date = date
		}
		
		self.points = aDecoder.decodeIntegerForKey("points")
		
		if let place = aDecoder.decodeObjectForKey("place") as? String {
			self.place = place
		}
		
	}
	
	func encodeWithCoder(aCoder: NSCoder) {
		aCoder.encodeObject(self.name, forKey: "name")
		aCoder.encodeObject(self.desc, forKey: "desc")
		aCoder.encodeObject(self.date, forKey: "date")
		aCoder.encodeInteger(self.points, forKey: "points")
		if let place = self.place {
			aCoder.encodeObject(place, forKey: "place")
		}
	}
}

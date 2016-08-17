//
//  User.swift
//  Twinder
//
//  Created by Jérémy Peltier on 27/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import Foundation

public class User: NSObject {
	
	var id: Int!
	var firstname: String!
	var lastname: String!
	var points: NSInteger! = 0
	var events: [Event]?
	
	override init() {
		super.init()
	}
	
	init(id: Int, firstname: String, lastname: String, points: NSInteger, events: [Event]?) {
		super.init()
		self.id = id
		self.firstname = firstname
		self.lastname = lastname
		self.points = points
		self.events = events
	}
	
	required public init(coder aDecoder: NSCoder) {
		
		self.id = Int(aDecoder.decodeIntForKey("id"))
		
		if let firstname = aDecoder.decodeObjectForKey("firstname") as? String {
			self.firstname = firstname
		}
		
		if let lastname = aDecoder.decodeObjectForKey("lastname") as? String {
			self.lastname = lastname
		}
		
		self.points = aDecoder.decodeIntegerForKey("points")
		
		if let events = aDecoder.decodeObjectForKey("events") as? [Event] {
			self.events = events
		}
		
	}
	
	func encodeWithCoder(aCoder: NSCoder) {
		aCoder.encodeInt(Int32(self.id), forKey: "id")
		aCoder.encodeObject(self.firstname, forKey: "firstname")
		aCoder.encodeObject(self.lastname, forKey: "lastname")
		aCoder.encodeInteger(self.points, forKey: "points")
		if let events = self.events {
			aCoder.encodeObject(events, forKey: "events")
		}
	}
	
}
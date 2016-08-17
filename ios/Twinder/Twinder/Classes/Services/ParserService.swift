//
//  ParserService.swift
//  Twinder
//
//  Created by Jérémy Peltier on 03/08/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

private let _ParserServiceInstance = ParserService()

class ParserService {
	
	class var sharedInstance: ParserService {
		return _ParserServiceInstance
	}

	func parseEvents(array: NSArray) -> [Event] {
		var events: [Event] = []
		
		for object in array as! [NSDictionary] {
			let event = Event()
			
			if let name = object.objectForKey("name") as? String {
				event.name = name
			}
			
			if let desc = object.objectForKey("description") as? String {
				event.desc = desc
			}
			
			if let date = object.objectForKey("date") as? String {
				let dateFormatter = NSDateFormatter()
				dateFormatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
				dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
				
				if let parsedDateTimeString = dateFormatter.dateFromString(date) {
					event.date = parsedDateTimeString
				}
			}
			
			if let points = object.objectForKey("points") as? Int {
				event.points = points
			}
			
			events.append(event)
			
		}
		
		return events
	}
	
	func parseUser(dictionnary: NSDictionary) -> User {
		let user = User()
		
		if let id = dictionnary.objectForKey("id") as? Int {
			user.id = id
		}
		if let points = dictionnary.objectForKey("points") as? Int {
			user.points = points
		}
		if let firstname = dictionnary.objectForKey("firstname") as? String {
			user.firstname = firstname
		}
		if let lastname = dictionnary.objectForKey("lastname") as? String {
			user.lastname = lastname
		}
		if let events = dictionnary.objectForKey("events") as? [NSDictionary] {
			user.events = ParserService.sharedInstance.parseEvents(events)
		}
		
		return user
	}
	
}

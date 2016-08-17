//
//  Error.swift
//  Twinder
//
//  Created by Paul Jarysta on 07/08/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import Foundation
import ObjectMapper

struct Error: Mappable {
	
	var cod: Int?
	var message: String?
	
	init?(_ map: Map) {
		
	}
	
	mutating func mapping(map: Map) {
		cod <- map["cod"]
		message <- map["message"]
	}
}

//
//  Rewards.swift
//  Twinder
//
//  Created by Paul Jarysta on 07/08/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import ObjectMapper

struct Reward: Mappable {
	var points: Int?
	var id: Int?
	var name: String?
	var description: String?
	
	init?(_ map: Map) {
		
	}
	
	mutating func mapping(map: Map) {
		points <- map["points"]
		id <- map["id"]
		name <- map["name"]
		description <- map["description"]
	}
}


struct Rewards: Mappable {
	var reward: [Reward]?

	init?(_ map: Map) {
		
	}
	
	mutating func mapping(map: Map) {
		reward <- map["rewards"]
	}
}


//
//  Constants.swift
//  Twinder
//
//  Created by Paul Jarysta on 22/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import Foundation
import UIKit

let DISCOGS_KEY = "zznuBbHZWyIiPFqJGtEX"

let DISCOGS_SECRET = "YnAEaJJVOJEWvyvtAqRmeoNbrfKmZYiE"

let DISCOGS_AUTH_URL = "https://api.discogs.com/database/search?q="

let HOST = "http://zerobeta.me:3001"

func login() -> String {
	return String(format: "%@/users/authenticate", HOST)
}

func me() -> String {
	return String(format: "%@/users/me", HOST)
}

func rewards() -> String {
	return String(format: "%@/rewards/list", HOST)
}

func comingSoonEventsList(page pageNumber: Int) -> String {
	return String(format: "%@/events/all?page=%d&upcoming=true", HOST, pageNumber)
}

func passedEventsList(page pageNumber: Int) -> String {
	return String(format: "%@/events/all?page=%d&past=true", HOST, pageNumber)
}


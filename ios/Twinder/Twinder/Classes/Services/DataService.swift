//
//  DataService.swift
//  Twinder
//
//  Created by Paul Jarysta on 22/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON
import ObjectMapper

private let _DataServiceInstance = DataService()

@objc
protocol DataServiceDelegate {
	optional func dataServiceDidSuccess(dictionnary result: NSDictionary)
	optional func dataServiceDidSuccess(array result: NSArray)
	optional func dataServiceDidError(error: NSError)
	optional func didFetch()
}

class DataService {
	
	var delegate: DataServiceDelegate?
	
	class var sharedInstance: DataService {
		return _DataServiceInstance
	}
	
	func get(url: String) {
		var headers: [String: String]?
		if UserManager.sharedInstance.authorization != nil {
			headers = ["Authorization":UserManager.sharedInstance.authorization!]
		}

		Alamofire.request(.GET, url, parameters: nil, encoding: ParameterEncoding.JSON, headers: headers)
			.validate()
			.responseJSON { response in
				switch response.result {
				case .Success:
					if let value = response.result.value {
						let json = JSON(value)
						print("JSON = \(json)")
						if let dictionnary = json.dictionaryObject {
							self.delegate?.dataServiceDidSuccess!(dictionnary: dictionnary)
						}
						if let array = json.arrayObject {
							self.delegate?.dataServiceDidSuccess!(array: array)
						}
					}
				case .Failure(let error):
					self.delegate?.dataServiceDidError!(error)
				}
		}
	}
	
	var items: Rewards?

	func getRewards(url: String) {
		var headers: [String: String]?
		if UserManager.sharedInstance.authorization != nil {
			headers = ["Authorization":UserManager.sharedInstance.authorization!]
		}
		
		Alamofire.request(.GET, url, parameters: nil, encoding: ParameterEncoding.JSON, headers: headers)
			.validate()
			.responseJSON { response in
				switch response.result {
				case .Success:
					if let value = response.result.value {
						let json = value
						print("JSON = \(json)")
						if let rewards = Mapper<Rewards>().map(json) {
							self.didFetch(rewards)
						}
					}
				case .Failure(let error):
					self.delegate?.dataServiceDidError!(error)
				}
		}
	}
	
	func didFetch(items: Rewards) {
		self.items = items
		self.delegate?.didFetch!()
	}

	
	func post(url: String, parameters: [String: AnyObject]?) {
		var headers: [String: String]?
		if UserManager.sharedInstance.authorization != nil {
			headers = ["Authorization":UserManager.sharedInstance.authorization!]
		}
		
		Alamofire.request(.POST, url, parameters: parameters, encoding: ParameterEncoding.JSON, headers: headers)
			.validate()
			.responseJSON { response in
				switch response.result {
				case .Success:
					if let value = response.result.value {
						let json = JSON(value)
						if let dictionnary = json.dictionaryObject {
							self.delegate?.dataServiceDidSuccess!(dictionnary: dictionnary)
						}
						if let array = json.arrayObject {
							self.delegate?.dataServiceDidSuccess!(array: array)
						}
					}
				case .Failure(let error):
					self.delegate?.dataServiceDidError!(error)
				}
		}
	}
	
}

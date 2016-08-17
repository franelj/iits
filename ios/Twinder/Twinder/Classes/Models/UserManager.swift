//
//  UserManager.swift
//  Twinder
//
//  Created by Jérémy Peltier on 27/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import Foundation
import UIKit

private let _UserManagerSharedInstance = UserManager()

public class UserManager: NSObject {
	
	private var userDefaults: NSUserDefaults = NSUserDefaults.standardUserDefaults()
	public var user: User?
	public var authorization: String?
	
	override public init() {
		super.init()
		
		if let user = self.userDefaults.objectForKey("user") as? User {
			self.user = user
		}
		if let authorization = self.userDefaults.objectForKey("authorization") as? String {
			self.authorization = authorization
		}
	}
	
	public class var sharedInstance: UserManager {
		return _UserManagerSharedInstance
	}
	
	public func login(viewController: UIViewController) {
		let bundle = NSBundle(forClass: LoginViewController.self)
		let storyboard = UIStoryboard(name: "Main", bundle: bundle)
		let controller = storyboard.instantiateViewControllerWithIdentifier("LoginNavigationViewController") as! UINavigationController
		viewController.presentViewController(controller, animated: true, completion: nil)
	}
	
	public func save() {
		self.userDefaults.setObject(user, forKey: "user")
		self.userDefaults.setObject(authorization, forKey: "authorization")
	}
	
}

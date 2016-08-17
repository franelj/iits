//
//  LoginViewController.swift
//  Twinder
//
//  Created by Jérémy Peltier on 27/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController {

	@IBOutlet weak var emailTextField: UITextField!
	@IBOutlet weak var passwordTextField: UITextField!
	
	override func viewDidLoad() {
		super.viewDidLoad()
		
		DataService.sharedInstance.delegate = self
		//		emailTextField.text = "admin"
		//		passwordTextField.text = "test"
		
		passwordTextField.tintColor = UIColor.whiteColor()
		emailTextField.tintColor = UIColor.whiteColor()
		passwordTextField.layer.borderColor = UIColor.whiteColor().CGColor
		emailTextField.layer.borderColor = UIColor.whiteColor().CGColor
		passwordTextField.textColor = UIColor.whiteColor()
		emailTextField.textColor = UIColor.whiteColor()
	}

	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}

	@IBAction func loginAction(sender: UIButton) {
		let alert = UIAlertController(title: "Warning", message: "An error has occured. Please try again later.", preferredStyle: UIAlertControllerStyle.Alert)
		alert.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler: nil))

		if (emailTextField.text?.characters.count)! > 0 && (passwordTextField.text?.characters.count)! > 0 {
			DataService.sharedInstance.post(login(), parameters: ["username":emailTextField.text!, "password":passwordTextField.text!])
		} else {
			alert.message = "Please provide all fields to log in."
			self.presentViewController(alert, animated: true, completion: nil)
		}
	}
	
}

extension LoginViewController: DataServiceDelegate {
	
	func dataServiceDidSuccess(dictionnary result: NSDictionary) {
		if let jwt = result.objectForKey("jwt") as? String {
			UserManager.sharedInstance.authorization = jwt
			DataService.sharedInstance.get(me())
		} else {
			UserManager.sharedInstance.user = ParserService.sharedInstance.parseUser(result)
			dismissViewControllerAnimated(true, completion: nil)
		}
	}
	
	func dataServiceDidError(error: NSError) {
		print(error)
	}
	
}
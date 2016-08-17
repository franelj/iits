//
//  String+EmailValidation.swift
//  Twinder
//
//  Created by Jérémy Peltier on 29/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import Foundation

extension String {
	
	func isValidEmail() -> Bool {
		let emailRegEx = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
		let emailTest = NSPredicate(format:"SELF MATCHES %@", emailRegEx)
		
		return emailTest.evaluateWithObject(self)
	}
	
}
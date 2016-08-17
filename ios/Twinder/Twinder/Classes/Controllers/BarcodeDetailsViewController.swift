//
//  BarcodeDetailsViewController.swift
//  Twinder
//
//  Created by Paul Jarysta on 25/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit
import Spring

class BarcodeDetailsViewController: UIViewController {
	
	
	@IBOutlet weak var viewBackground: UIView!
	@IBOutlet weak var imageBackground: UIImageView!
	
	@IBOutlet weak var nameLb: UILabel!
	@IBOutlet weak var dateLb: UILabel!
	@IBOutlet weak var addressLb: UILabel!
	@IBOutlet weak var descriptionTV: UITextView!


	@IBOutlet weak var saveBtn: SpringButton!
	
	var event: Event?
	
	var barcodeValue: String?
	
	var saveColor: UIColor = UIColor(red: 52/255, green: 152/255, blue: 219/255, alpha: 1)
	
	override func viewDidLoad() {
		super.viewDidLoad()
	
		title = barcodeValue

		customView()
	}
	
	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}

	func customView() {
		let dateFormatter = NSDateFormatter()
		dateFormatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
		dateFormatter.dateFormat = "MMM d, yyyy - H:mm a"
		
		viewBackground.backgroundColor = saveColor
		imageBackground.layer.masksToBounds = true
		descriptionTV.font = UIFont.systemFontOfSize(16)
		if (barcodeValue == nil) {
			saveBtn.hidden = true
		}
		
		if (event != nil) {
			nameLb.text = event?.name.uppercaseString
			
			dateLb.text = dateFormatter.stringFromDate((event?.date)!)
			imageBackground.image = UIImage(named: "background")
			addressLb.text = "CSUSM - Forum Plaza"
			descriptionTV.text = event?.desc
			descriptionTV.font = UIFont.systemFontOfSize(16)
		} else {
			nameLb.text = "Final Presentation to IITS"
			let date = NSDate()
			let calendar = NSCalendar.currentCalendar()
			let components = calendar.components([.Day , .Month , .Year], fromDate: date)
			
			let year =  components.year
			let month = components.month
			let day = components.day
			dateLb.text = "\(day) August \(year) - 11:20 AM"
			addressLb.text = "CSUSM - Forum Plaza"
			descriptionTV.font = UIFont.systemFontOfSize(16)
			descriptionTV.text = "Campus Way Finding: 11:10-11:20 AM (Tyson)\nAffinity Program: Student Engagement 11:20-11:30 AM (Tyson)\nActivity Tracker: 11:30-11:40 AM (Justin/Tyson)\nWifi Quality App: 11:40-11:50 AM (Justin)\nFirewall Simulator: 11:50-12 PM (Justin)"

			saveBtn.delay = 1.0
			saveBtn.duration = 1.0
			saveBtn.force = 1.0
			saveBtn.animation = "squeezeUp"
			saveBtn.animate()
			saveBtn.animateNext({
				self.saveBtn.animation = "fadeOut"
				self.saveBtn.delay = 3.0
				self.saveBtn.duration = 1.0
				self.saveBtn.force = 1.0
				self.saveBtn.animate()
			})
		}
	}
	
	@IBAction func stateBtn(sender: UIButton) {
	
	}
	
}

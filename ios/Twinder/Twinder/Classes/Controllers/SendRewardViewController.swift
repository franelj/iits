//
//  SendRewardViewController.swift
//  Twinder
//
//  Created by Paul Jarysta on 07/08/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

class SendRewardViewController: UIViewController {
	
	
	@IBOutlet weak var imageView: UIImageView!
	
	@IBOutlet weak var label: UILabel!
	
	@IBOutlet weak var textView: UILabel!
	
	override func viewDidLoad() {
		super.viewDidLoad()
		view.backgroundColor = UIColor(red: 241/255, green: 196/255, blue: 15/255, alpha: 1)
		
		textView.text = "You will receive an email confirming your purchase."
	}
	
	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}
	
	
}

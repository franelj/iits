//
//  RewardTableViewCell.swift
//  Twinder
//
//  Created by Paul Jarysta on 29/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

@objc protocol RewardTableViewCellDelegate {
	func controller(controller: RewardTableViewCell, selectedSegmentSender:UISegmentedControl, selectedSegmentIndex:Int, indexPath : NSIndexPath, textField: UITextField)
}

class RewardTableViewCell: UITableViewCell {
	
	@IBOutlet weak var nameLb: UILabel!
	@IBOutlet weak var valueLb: UILabel!
	@IBOutlet weak var countTf: UITextField!
	@IBOutlet weak var changeSeg: UISegmentedControl!
	
	var delegate: AnyObject?
	var indexPath : NSIndexPath?
	
	override func awakeFromNib() {
		super.awakeFromNib()
		changeSeg.momentary = true
		changeSeg.tintColor = UIColor(red: 241/255, green: 196/255, blue: 15/255, alpha: 1)
	}
	
	override func setSelected(selected: Bool, animated: Bool) {
		super.setSelected(selected, animated: animated)
	}
	
	@IBAction func changeAction(sender: UISegmentedControl) {
		self.delegate?.controller(self, selectedSegmentSender: sender, selectedSegmentIndex: sender.selectedSegmentIndex, indexPath: indexPath!, textField: countTf)
	}
	
}

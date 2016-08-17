//
//  EventTableViewCell.swift
//  Twinder
//
//  Created by Jérémy Peltier on 22/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

class EventTableViewCell: UITableViewCell {
	
	@IBOutlet weak var eventName: UILabel!
	@IBOutlet weak var eventDate: UILabel!
	@IBOutlet weak var eventPoints: UILabel!

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}

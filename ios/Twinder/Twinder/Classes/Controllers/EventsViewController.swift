//
//  EventsViewController.swift
//  Twinder
//
//  Created by Jérémy Peltier on 27/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

let kComingSoonSelectedSegmentIndex = 0
let kPassedSelectedSegmentIndex = 1

class EventsViewController: UIViewController {
	
	@IBOutlet weak var tableView: UITableView!
	
	@IBOutlet weak var segControl: UISegmentedControl!

	var events: [Event] = []

    override func viewDidLoad() {
        super.viewDidLoad()
	}
	
	override func viewWillAppear(animated: Bool) {
		super.viewWillAppear(animated)
		
		tabBarController?.tabBar.tintColor = UIColor(red: 46/255, green: 204/255, blue: 113/255, alpha: 1)
		navigationController?.navigationBar.barTintColor = UIColor(red: 46/255, green: 204/255, blue: 113/255, alpha: 1)
		segControl.tintColor = UIColor.whiteColor()
//		navigationController?.navigationBar.translucent = false
//		navigationController?.navigationBar.opaque = true
		
		DataService.sharedInstance.delegate = self
		DataService.sharedInstance.get(comingSoonEventsList(page: 1))
		
		tableView.dataSource = self
		tableView.delegate = self
		
		tableView.reloadData()
	}

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
	
	
	// When the value of the UISegmentedControl of the navigation bar changed
	@IBAction func eventTypeChanged(sender: UISegmentedControl) {
		if sender.selectedSegmentIndex == kComingSoonSelectedSegmentIndex {
			DataService.sharedInstance.get(comingSoonEventsList(page: 1))
		} else if sender.selectedSegmentIndex == kPassedSelectedSegmentIndex {
			DataService.sharedInstance.get(passedEventsList(page: 1))
		} else {
			events = []
		}
		tableView.reloadData()
	}

}

extension EventsViewController: DataServiceDelegate {
	
	func dataServiceDidSuccess(array result: NSArray) {
		events = ParserService.sharedInstance.parseEvents(result)
		tableView.reloadData()
	}
	
	func dataServiceDidError(error: NSError) {
		print(error)
	}
	
}


extension EventsViewController: UITableViewDataSource {

	func numberOfSectionsInTableView(tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return events.count
	}
	
	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
		let cell = tableView.dequeueReusableCellWithIdentifier("EventCell", forIndexPath: indexPath) as! EventTableViewCell
		let event = events[indexPath.row]
		let dateFormatter = NSDateFormatter()
		dateFormatter.locale = NSLocale(localeIdentifier: "en_US_POSIX")
		dateFormatter.dateFormat = "MMM d, yyyy - H:mm a"
		
		cell.eventName.textColor = UIColor(red: 46/255, green: 204/255, blue: 113/255, alpha: 1)
		cell.eventName.text = event.name.uppercaseString
		cell.eventDate.text = dateFormatter.stringFromDate(event.date)
		cell.eventPoints.text = String(format: "%d", event.points)
		
		return cell
	}
	
}

extension EventsViewController: UITableViewDelegate {
	
	func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
		let controller = storyboard?.instantiateViewControllerWithIdentifier("EVENT_DETAILS") as! BarcodeDetailsViewController
		controller.event = events[indexPath.row]
		controller.saveColor = UIColor(red: 46/255, green: 204/255, blue: 113/255, alpha: 1)
		navigationController?.pushViewController(controller, animated: true)
	}
	
}

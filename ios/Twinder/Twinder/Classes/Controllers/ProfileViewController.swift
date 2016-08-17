//
//  ProfileViewController.swift
//  Twinder
//
//  Created by Jérémy Peltier on 11/07/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

class ProfileViewController: UIViewController {
	
	@IBOutlet weak var pointsNumberLabel: UILabel!
	@IBOutlet weak var eventsNumberLabel: UILabel!
	@IBOutlet weak var eventsTableView: UITableView!
	
	var userEvents: [Event] = []
	
	override func viewDidLoad() {
		super.viewDidLoad()
		
		setProfile()
	}
	
	override func viewWillAppear(animated: Bool) {
		super.viewWillAppear(animated)
		
		tabBarController?.tabBar.tintColor = UIColor(red: 231/255, green: 76/225, blue: 60/255, alpha: 1)
		navigationController?.navigationBar.barTintColor = UIColor(red: 231/255, green: 76/225, blue: 60/255, alpha: 1)
		navigationController?.navigationBar.tintColor = UIColor.whiteColor()
		
		DataService.sharedInstance.delegate = self
		DataService.sharedInstance.get(me())
	}
	
	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}
	
	func setProfile() {
		// title = String(format: "%@ %@", (UserManager.sharedInstance.user?.firstname)!, (UserManager.sharedInstance.user?.lastname)!)
		title = "John Doe"
		tabBarController?.tabBar.selectedItem?.title = "Profile"
		
		pointsNumberLabel.text = String(format: "%d", (UserManager.sharedInstance.user?.points)!)
		eventsNumberLabel.text = String(format: "%d", (UserManager.sharedInstance.user?.events!.count)!)
		
		eventsTableView.reloadData()
	}
	
}

extension ProfileViewController: DataServiceDelegate {
	
	func dataServiceDidSuccess(dictionnary result: NSDictionary) {
		UserManager.sharedInstance.user = ParserService.sharedInstance.parseUser(result)
		setProfile()
	}
	
	func dataServiceDidError(error: NSError) {
		print(error)
	}
	
}

extension ProfileViewController: UITableViewDataSource {

	func numberOfSectionsInTableView(tableView: UITableView) -> Int {
		return 1
	}
	
	func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return (UserManager.sharedInstance.user?.events!.count)!
	}
	
	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
		let cell = tableView.dequeueReusableCellWithIdentifier("EventCell", forIndexPath: indexPath) as! EventTableViewCell
		let event = (UserManager.sharedInstance.user?.events![indexPath.row])!
		let dateFormatter = NSDateFormatter()
		dateFormatter.dateFormat = "MM-dd-yyyy hh:mm"
		
		cell.eventName.textColor = UIColor(red: 231/255, green: 76/225, blue: 60/255, alpha: 1)
		cell.eventName.text = event.name.uppercaseString
		cell.eventDate.text = dateFormatter.stringFromDate(event.date)
		cell.eventPoints.text = String(format: "%d", event.points)
		
		return cell
	}
	
}

extension ProfileViewController: UITableViewDelegate {
	
	func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
		let controller = storyboard?.instantiateViewControllerWithIdentifier("EVENT_DETAILS") as! BarcodeDetailsViewController
		controller.event = (UserManager.sharedInstance.user?.events![indexPath.row])!
		controller.saveColor = UIColor(red: 231/255, green: 76/225, blue: 60/255, alpha: 1)

		navigationController?.pushViewController(controller, animated: true)
	}
	
}

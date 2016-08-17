//
//  RewardsViewController.swift
//  Twinder
//
//  Created by Paul Jarysta on 29/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit

class RewardsViewController: UIViewController {
	
	@IBOutlet weak var itemDoneBtn: UIBarButtonItem!
	
	@IBOutlet weak var tableView: UITableView!
	
	var cellIdentifier: String = "Cell"
	var titleCount: String?
	var totalCount: Int? = 0
	var count: Int?
	var countReward: [Int] = []
	
	var selectedAnswerIndex : NSMutableArray = []
	
	var selectedSegmentsIndexPath : NSMutableArray = []

	var rewardsArrayName: [String] = ["Water", "Snacks", "Stickers", "Cola", "Iced Tea", "Orange Juice", "Books"]
	var rewardsArrayCost: [String] = ["2", "1", "3", "2", "1", "2", "5"]
	
	var itemsRewards: [Reward] = []
	
	override func viewDidLoad() {
		super.viewDidLoad()
		
		totalCount = UserManager.sharedInstance.user?.points
		print("Total count = \(totalCount)")
		DataService.sharedInstance.delegate = self
		tableView.delegate = self
		tableView.dataSource = self
		
		DataService.sharedInstance.getRewards(rewards())

		
		if totalCount == 0 {
			alertCount()
		}
		
		if let total = totalCount {
			titleCount = "\(total)"
		}
		
		customView()
		
	}
	
	override func viewWillAppear(animated: Bool) {
		super.viewWillAppear(animated)
		
		tabBarController?.tabBar.tintColor = UIColor(red: 241/255, green: 196/255, blue: 15/255, alpha: 1)
		navigationController?.navigationBar.barTintColor = UIColor(red: 241/255, green: 196/255, blue: 15/255, alpha: 1)
	}
	
	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}
	
	func customView() {
		self.navigationItem.titleView = setTitle(titleCount!, subtitle: "points")
		title = "Rewards"
	}
	
	func setTitle(title:String, subtitle:String) -> UIView {
		let titleLabel = UILabel(frame: CGRectMake(0, 0, 200, 20))
		
		titleLabel.backgroundColor = UIColor.clearColor()
		titleLabel.textColor = UIColor.whiteColor()
		titleLabel.font = UIFont.boldSystemFontOfSize(17)
		titleLabel.text = title
		titleLabel.textAlignment = .Center
//		titleLabel.sizeToFit()
		
		let subtitleLabel = UILabel(frame: CGRectMake(0, 18, 200, 13))
		subtitleLabel.backgroundColor = UIColor.clearColor()
		subtitleLabel.textColor = UIColor.whiteColor()
		subtitleLabel.font = UIFont.systemFontOfSize(12)
		subtitleLabel.text = subtitle
		subtitleLabel.textAlignment = .Center
		
		let titleView = UIView(frame: CGRectMake(0, 0, max(titleLabel.frame.size.width, subtitleLabel.frame.size.width), 33))
		titleView.backgroundColor = UIColor.clearColor()
		titleView.addSubview(titleLabel)
		titleView.addSubview(subtitleLabel)
		
//		let widthDiff = subtitleLabel.frame.size.width - titleLabel.frame.size.width
//		
//		if widthDiff > 0 {
//			var frame = titleLabel.frame
//			frame.origin.x = widthDiff / 2
//			titleLabel.frame = CGRectIntegral(frame)
//		} else {
//			var frame = subtitleLabel.frame
//			frame.origin.x = abs(widthDiff) / 2
//			titleLabel.frame = CGRectIntegral(frame)
//		}
		return titleView
	}
	
	
	// MARK: - Navigation
	
	override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
		print(totalCount)
	}

	
	@IBAction func doneAction(sender: UIBarButtonItem) {
		
	}
	
	func getRewards() {
		if let items = DataService.sharedInstance.items {
			if let reward = items.reward {
				itemsRewards = reward
				for (var i = 0; i < itemsRewards.count; i++) {
					countReward.append(0)
				}
				print(countReward)
				tableView.reloadData()
			}
		}
	}
}

extension RewardsViewController: DataServiceDelegate {
	
	func didFetch() {
		getRewards()
	}
	
	func dataServiceDidSuccess(result: NSDictionary) {
		
		
		print(result)
	
	}
	
	func dataServiceDidError(error: NSError) {
		print(error)
	}
}

extension RewardsViewController: RewardTableViewCellDelegate {
	
	func alertCount() {
		let alertController = UIAlertController(title: "Your points are at 0", message: "Participate to event to win more points.", preferredStyle: .Alert)
		
		let infoAction = UIAlertAction(title: "OK", style: .Cancel) { (action) in }
		alertController.addAction(infoAction)
		self.presentViewController(alertController, animated: true) {
			self.totalCount = 0
			self.navigationItem.titleView = self.setTitle("0", subtitle: "points")
		}
	}
	
	func controller(controller: RewardTableViewCell, selectedSegmentSender: UISegmentedControl, selectedSegmentIndex:Int, indexPath : NSIndexPath, textField: UITextField)
	{
//		print("SegIndex: \(selectedSegmentIndex) // Index: \(indexPath.row)")
//		print("Tag: \(selectedSegmentSender.tag)")
//		print("SelectedAnswerIndex: \(selectedAnswerIndex)")
//		print("SelectedSegmentsIndexPath: \(selectedSegmentsIndexPath)")
//
//		print("SegIndex: \(selectedSegmentIndex) // Index: \(indexPath.row) // Value: \(selectedSegmentSender.tag) // State \(selectedSegmentSender.selectedSegmentIndex)")
//		print("-----")
		
		count = 0
		if selectedSegmentSender.selectedSegmentIndex == 0 {
			if textField.tag == indexPath.row {
				if Int(textField.text!) > 0 {
					totalCount = totalCount! + selectedSegmentSender.tag
					if totalCount < 0 {
						totalCount = 0
					}
					count = countReward[indexPath.row] - 1
					if count <= 0 {
						count = 0
					}
				}
			}

			// TODO - Bloquer quand le textField est a 0 le decompte du total

		} else if selectedSegmentSender.selectedSegmentIndex == 1 {
			if totalCount > 0 {
				count = countReward[indexPath.row] + 1
				
				totalCount = totalCount! - selectedSegmentSender.tag
				if totalCount <= 0 {
					alertCount()
				}
			} else {
				alertCount()
			}
		}

		print("countReward: \(countReward)")
		countReward[indexPath.row] = count!
		
		if textField.tag == indexPath.row {
			textField.text = "\(countReward[indexPath.row])"
		}
		
		if let total = totalCount {
			self.navigationItem.titleView = setTitle("\(total)", subtitle: "points")
		}

	}
}

extension RewardsViewController: UITableViewDataSource {
	
	func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
		return itemsRewards.count
	}
	
	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
		
		let cell = tableView.dequeueReusableCellWithIdentifier(cellIdentifier, forIndexPath: indexPath) as! RewardTableViewCell

//		if(selectedSegmentsIndexPath.containsObject(indexPath))
//		{
//			cell.changeSeg.selectedSegmentIndex = selectedAnswerIndex.objectAtIndex(selectedSegmentsIndexPath.indexOfObject(indexPath)) as! Int
//		}
		if let name = itemsRewards[indexPath.row].name, points = itemsRewards[indexPath.row].points {
			cell.selectionStyle = UITableViewCellSelectionStyle.None
			
			cell.delegate = self
			cell.indexPath = indexPath
			cell.countTf.tag = indexPath.row
			cell.changeSeg.selectedSegmentIndex = indexPath.row
			cell.changeSeg.tag = Int(points)
			cell.nameLb.text = "\(name.uppercaseString)"
			cell.valueLb.text = "Value: \(points)pt"
		}
		return cell
	}
}

extension RewardsViewController: UITableViewDelegate {
	
}
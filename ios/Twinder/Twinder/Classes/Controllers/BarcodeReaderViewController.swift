//
//  BarcodeReaderViewController.swift
//  Twinder
//
//  Created by Paul Jarysta on 20/06/2016.
//  Copyright © 2016 Paul Jarysta. All rights reserved.
//

import UIKit
import AVFoundation

class BarcodeReaderViewController: UIViewController {

	var session: AVCaptureSession!
	var previewLayer: AVCaptureVideoPreviewLayer!
	
	var trimmedCodeNoZero: String?
	
	override func viewDidLoad() {
		super.viewDidLoad()

		title = "Scan"
		// Create a session object.
		
		session = AVCaptureSession()
		
		// Set the captureDevice.
		
		let videoCaptureDevice = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)
		
		// Create input object.
		
		let videoInput: AVCaptureDeviceInput?
		
		do {
			videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
		} catch {
			return
		}
		
		// Add input to the session.
		
		if (session.canAddInput(videoInput)) {
			session.addInput(videoInput)
		} else {
			scanningNotPossible()
		}
		
		// Create output object.
		
		let metadataOutput = AVCaptureMetadataOutput()
		
		// Add output to the session.
		
		if (session.canAddOutput(metadataOutput)) {
			session.addOutput(metadataOutput)
			
			// Send captured data to the delegate object via a serial queue.
			
			metadataOutput.setMetadataObjectsDelegate(self, queue: dispatch_get_main_queue())
			
			// Set barcode type for which to scan: EAN-13.
			
			metadataOutput.metadataObjectTypes = [AVMetadataObjectTypeEAN13Code]
			
		} else {
			scanningNotPossible()
		}
		
		// Add previewLayer and have it show the video data.
		
		previewLayer = AVCaptureVideoPreviewLayer(session: session);
		previewLayer.frame = view.layer.bounds;
		previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
		view.layer.addSublayer(previewLayer);
		
		// Begin the capture session.
		
		session.startRunning()
	}
	
	override func viewWillAppear(animated: Bool) {
		super.viewWillAppear(animated)

		tabBarController?.tabBar.tintColor = UIColor(red: 52/255, green: 152/255, blue: 219/255, alpha: 1)
		navigationController?.navigationBar.barTintColor = UIColor(red: 52/255, green: 152/255, blue: 219/255, alpha: 1)
		
		if (session?.running == false) {
			session.startRunning()
		}
	}
	
	override func viewWillDisappear(animated: Bool) {
		super.viewWillDisappear(animated)
		
		if (session?.running == true) {
			session.stopRunning()
		}
	}
	
	override func viewDidAppear(animated: Bool) {
		super.viewDidAppear(animated)
		
		// If the user does not connected, we launch the login view
		if UserManager.sharedInstance.user == nil {
			UserManager.sharedInstance.login(self)
		}
	}

	override func didReceiveMemoryWarning() {
		super.didReceiveMemoryWarning()
	}
	
	func scanningNotPossible() {
		// Let the user know that scanning isn't possible with the current device.
		let alert = UIAlertController(title: "Can't Scan.", message: "Let's try a device equipped with a camera.", preferredStyle: .Alert)
		alert.addAction(UIAlertAction(title: "OK", style: .Default, handler: nil))
		presentViewController(alert, animated: true, completion: nil)
		session = nil
	}
	
	func captureOutput(captureOutput: AVCaptureOutput!, didOutputMetadataObjects metadataObjects: [AnyObject]!, fromConnection connection: AVCaptureConnection!) {
		
		// Get the first object from the metadataObjects array.
		
		if let barcodeData = metadataObjects.first {
			
			// Turn it into machine readable code
		
			let barcodeReadable = barcodeData as? AVMetadataMachineReadableCodeObject;
			
			if let readableCode = barcodeReadable {
				
				// Send the barcode as a string to barcodeDetected()
				
				barcodeDetected(readableCode.stringValue);
			}
			
			// Vibrate the device to give the user some feedback.
			
			AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
			
			// Avoid a very buzzy device.
			
			session.stopRunning()
		}
	}
	
	func barcodeDetected(code: String) {
		
		// Let the user know we've found something.
		
		let alert = UIAlertController(title: "Found a Barcode!", message: code, preferredStyle: UIAlertControllerStyle.Alert)
		
		// Remove the spaces.
		
		let trimmedCode = code.stringByTrimmingCharactersInSet(NSCharacterSet.whitespaceCharacterSet())
		
		// EAN or UPC?
		// Check for added "0" at beginning of code.
		
		let trimmedCodeString = "\(trimmedCode)"
		
		
		if trimmedCodeString.hasPrefix("0") && trimmedCodeString.characters.count > 1 {
			trimmedCodeNoZero = String(trimmedCodeString.characters.dropFirst())
			
			// Send the doctored UPC to DataService.searchAPI()
			// trimmedCodeNoZero ==> codeValue !!!
			
		}

		trimmedCodeNoZero = trimmedCodeString
		alert.addAction(UIAlertAction(title: "Cancel", style: UIAlertActionStyle.Cancel, handler: { action in
			if (self.session?.running == true) {
				self.session.stopRunning()
			}
			
			if (self.session?.running == false) {
				self.session.startRunning()
			}
			
		}))
		
		alert.addAction(UIAlertAction(title: "Search", style: UIAlertActionStyle.Default, handler: { action in
			
			self.performSegueWithIdentifier("detailsBarcode", sender: self)

		}))
		
		
		self.presentViewController(alert, animated: true, completion: nil)
	}
	
	
	// MARK: - Navigation
	
	override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
		if (segue.identifier == "detailsBarcode") {

			let destinationViewController = segue.destinationViewController as! BarcodeDetailsViewController
			destinationViewController.barcodeValue = trimmedCodeNoZero
		}
	}

}

extension BarcodeReaderViewController: AVCaptureMetadataOutputObjectsDelegate {
	
	
}

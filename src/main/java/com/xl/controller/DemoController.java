package com.xl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.xl.service.DemoService;

@Controller
public class DemoController {

	@Autowired
	private DemoService demoService;
	
	
	@RequestMapping("/index")
	public ModelAndView gotoPage(){
		ModelAndView model = new ModelAndView("index");
		String sayHello = demoService.sayHello("大兵");
		model.addObject("sayHello", sayHello);
		return model;
	}
}

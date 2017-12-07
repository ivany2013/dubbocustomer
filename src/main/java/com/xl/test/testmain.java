package com.xl.test;

import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.xl.service.DemoService;

public class testmain {
	public static void main(String[] args) {
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(
				"classpath:applicationConsumer.xml");
			  context.start();
			  DemoService demoService = (DemoService) context.getBean("demoService"); // get
			  String hello = "";
			  try {
			   hello = demoService.sayHello("nihao");
			  } catch (Exception e) {
			   e.printStackTrace();
			  } // do invoke!
			  System.out.println(Thread.currentThread().getName() + " " + hello);
			 }
	}

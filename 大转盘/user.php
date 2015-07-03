<?php
	header("Access-Control-Allow-Origin: *");
	$data['list'] = array(array("tel"=>"13036315***","prise"=>"幸运奖"),array("tel"=>"13036315***","prise"=>"幸运奖"),array("tel"=>"13036315***","prise"=>"幸运奖"),array("tel"=>"13036315***","prise"=>"幸运奖"),array("tel"=>"13333315***","prise"=>"幸运奖"));
	$data['data']= json_decode('{"data":[
	{
		"id":0,"url":"http://yz.doupu.cn/phone.png","text":"一等奖"
	},
	{
		"id":1,"url":"http://yz.doupu.cn/phone.png","text":"二等奖"
	},
	{
		"id":2,"url":"http://yz.doupu.cn/phone.png","text":"三等奖"
	},
	{
		"id":3,"url":"http://yz.doupu.cn/phone.png","text":"四等奖"
	},
	{
		"id":4,"url":"http://yz.doupu.cn/phone.png","text":"五等奖"
	},
	{
		"id":5,"url":null,"text":"谢谢惠顾"
	},
	{
		"id":6,"url":"http://yz.doupu.cn/phone.png","text":"幸运奖"
	},
	{
		"id":7,"url":null,"text":"谢谢惠顾"
	}
]}'); 
	echo json_encode($data);
?>
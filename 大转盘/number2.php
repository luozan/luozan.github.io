<?php
	header("Access-Control-Allow-Origin: *");
	$chance = 10;
	if($chance <= 0){
		$array['state'] = 'error';
		$array['errorMessge'] = '剩余0次抽奖机会';
		echo json_encode($array);
		return;
	}
	$id = mt_rand(0,5);
	$array = array("number"=>$id);
	if($id == 7 || $id == 5){
		$array['text'] = "很遗憾您没有中奖";
		$array['isHit'] = false;
	}
	else if($id == 6){
		$array['text'] = '恭喜你获得幸运奖';
		$array['isHit'] = true;
	}
	else{
		$array['text'] = '恭喜你获得'.($id+1).'等奖';
		$array['isHit'] = true;
	}
	$array['token'] = md5(time());
	echo json_encode($array);
?>
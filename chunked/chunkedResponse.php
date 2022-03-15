<?php
	$dateTimeNow = microtime(true);

	$waitMS = 0;
	if (isset($_GET['waitMS'])) {
		$waitMS = $_GET['waitMS'];
	}

	// wait before any response (TTFB)
	$dateTimeToStart = $dateTimeNow + ($waitMS/1000);
	while (microtime(true) < $dateTimeToStart) {
		usleep(50);
	}
	//usleep($_GET['waitMS']*1000);

	$downloadMS = 1000;
	if (isset($_GET['downloadMS'])) {
		$downloadMS = $_GET['downloadMS'];
	}
		
?>

<html>
<head></head>
<body>

<?php
if (!isset($_GET['quieter'])) {
?>

<p>
This page will keep replying with chunked responses for <?php echo $downloadMS; ?> milliseconds (param 'downloadMS'), with a delayed wait time (before responding, so TTFB) of <?php echo $waitMS; ?> milliseconds (param 'waitMS').
</p>

<?php
}
?>


<?php

	$dateTimeNow = microtime(true);
	$dateTimeToStop = $dateTimeNow + ($downloadMS/1000);

	if (!isset($_GET['quieter'])) {
		echo "Now: $dateTimeNow stop at $dateTimeToStop <br>" ;
	}
	
	$characterWrapper = 0;
	while (microtime(true) <= $dateTimeToStop) {
		echo ".";
		$characterWrapper ++;
		if ($characterWrapper % 300 == 0) {
			$characterWrapper = 0;
			echo ".";
		}

		ob_flush();
		flush();
		usleep(200);
	}

?>


</body>
</html>


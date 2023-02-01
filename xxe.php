<?php
$xmlfile = file_get_contents('php://input');
$dom = new DOMDocument();
$dom->loadXML($xmlfile, LIBXML_NOENT | LIBXML_DTDLOAD);
$xml = simplexml_import_dom($dom);
$stuff = $xml->stuff;

$str = "$stuff \n";

echo $str;
?>

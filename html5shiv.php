<?php

function html5shiv_head() {
	?>
<!--[if lt IE 9]>
<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
	<?php
}

pai_add_action('head', 'html5shiv_head');
export const beigeTemplate = (dynamic) => `<!DOCTYPE html>
<html
    lang="en"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml"
>
    <head>
        <title></title>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <!--[if mso
            ]><xml
                ><o:OfficeDocumentSettings
                    ><o:PixelsPerInch>96</o:PixelsPerInch
                    ><o:AllowPNG /></o:OfficeDocumentSettings></xml
        ><![endif]-->
        <style>
            * {
                box-sizing: border-box;
            }

            body {
                margin: 0;
                padding: 0;
            }

            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: inherit !important;
            }

            #MessageViewBody a {
                color: inherit;
                text-decoration: none;
            }

            p {
                line-height: inherit;
            }

            .desktop_hide,
            .desktop_hide table {
                mso-hide: all;
                display: none;
                max-height: 0px;
                overflow: hidden;
            }

            .menu_block.desktop_hide .menu-links span {
                mso-hide: all;
            }

            .fix-left-timeline {
                display: flex !important;
                justify-content: flex-end;
            }
            
            .fix-anchor:hover {
                color: #ced4da !important	;
            }
            
            .fix-anchor {
                text-align: start;
                display: flex;
            }
            
            .timeline-ref .time-wrapper {
                min-width: 102px;
            }
            
            .direction-l .timeline-ref {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
            
                                                                        

            @media (max-width: 700px) {
                .desktop_hide table.icons-inner {
                    display: inline-block !important;
                }

                .icons-inner {
                    text-align: center;
                }

                .icons-inner td {
                    margin: 0 auto;
                }

                .fullMobileWidth,
                .row-content {
                    width: 100% !important;
                }

                .menu-checkbox[type='checkbox'] ~ .menu-links {
                    display: none !important;
                    padding: 5px 0;
                }

                .menu-checkbox[type='checkbox']:checked ~ .menu-trigger .menu-open {
                    display: none !important;
                }

                .menu-checkbox[type='checkbox']:checked ~ .menu-links,
                .menu-checkbox[type='checkbox'] ~ .menu-trigger {
                    display: block !important;
                    max-width: none !important;
                    max-height: none !important;
                    font-size: inherit !important;
                }

                .menu-checkbox[type='checkbox'] ~ .menu-links > a,
                .menu-checkbox[type='checkbox'] ~ .menu-links > span.label {
                    display: block !important;
                    text-align: center;
                }

                .menu-checkbox[type='checkbox']:checked ~ .menu-trigger .menu-close {
                    display: block !important;
                }

                .mobile_hide {
                    display: none;
                }

                .stack .column {
                    width: 100%;
                    display: block;
                }

                .mobile_hide {
                    min-height: 0;
                    max-height: 0;
                    max-width: 0;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide,
                .desktop_hide table {
                    display: table !important;
                    max-height: none !important;
                }
            }

            #menu111:checked ~ .menu-links {
                background-color: #1e2f40 !important;
            }

            #menu111:checked ~ .menu-links a,
            #menu111:checked ~ .menu-links span {
                color: #ffffff !important;
            }
            @import url(https://fonts.googleapis.com/css?family=Raleway:400,900);

body {
	font-family: 'Raleway', sans-serif;
	color: #333;
}

header h1 {
	text-align: center;
	font-weight: bold;
	margin-top: 0;
}

header p {
	text-align: center;
	margin-bottom: 0;
}

.hexa {
	border: 0px;
	float: left;
	text-align: center;
	height: 35px;
	width: 60px;
	font-size: 22px;
	color: #3c3c3c;
	position: relative;
	margin-top: 15px;
}

.hexa:before {
	content: '';
	position: absolute;
	left: 0;
	width: 0;
	height: 0;
	border-bottom: 15px solid #f0f0f0;
	border-left: 30px solid transparent;
	border-right: 30px solid transparent;
	top: -15px;
}

.hexa:after {
	content: '';
	position: absolute;
	left: 0;
	width: 0;
	height: 0;
	border-left: 30px solid transparent;
	border-right: 30px solid transparent;
	border-top: 15px solid #f0f0f0;
	bottom: -15px;
}

.timeline {
	position: relative;
	padding: 0;
	width: 100%;
	margin-top: 20px;
	list-style-type: none;
}

.timeline:before {
	position: absolute;
	left: 50%;
	top: 0;
	content: ' ';
	display: block;
	width: 2px;
	height: 100%;
	margin-left: -1px;
	background: -moz-linear-gradient(
		top,
		rgba(213, 213, 213, 0) 0%,
		rgb(213, 213, 213) 8%,
		rgb(213, 213, 213) 92%,
		rgba(213, 213, 213, 0) 100%
	);
	background: -webkit-gradient(
		linear,
		left top,
		left bottom,
		color-stop(0%, rgba(30, 87, 153, 1)),
		color-stop(100%, rgba(125, 185, 232, 1))
	);
	background: -webkit-linear-gradient(
		top,
		rgba(213, 213, 213, 0) 0%,
		rgb(213, 213, 213) 8%,
		rgb(213, 213, 213) 92%,
		rgba(213, 213, 213, 0) 100%
	);
	background: -o-linear-gradient(
		top,
		rgba(213, 213, 213, 0) 0%,
		rgb(213, 213, 213) 8%,
		rgb(213, 213, 213) 92%,
		rgba(213, 213, 213, 0) 100%
	);
	background: -ms-linear-gradient(
		top,
		rgba(213, 213, 213, 0) 0%,
		rgb(213, 213, 213) 8%,
		rgb(213, 213, 213) 92%,
		rgba(213, 213, 213, 0) 100%
	);
	background: linear-gradient(
		to bottom,
		rgba(213, 213, 213, 0) 0%,
		rgb(213, 213, 213) 8%,
		rgb(213, 213, 213) 92%,
		rgba(213, 213, 213, 0) 100%
	);
	z-index: 5;
}

.timeline li {
	padding: 2em 0;
}

.timeline .hexa {
	width: 16px;
	height: 10px;
	position: absolute;
	background: #976653;
	z-index: 5;
	left: 0;
	right: 0;
	margin-left: auto;
	margin-right: auto;
	top: -30px;
	margin-top: 0;
}

.timeline .hexa:before {
	border-bottom: 4px solid #976653;
	border-left-width: 8px;
	border-right-width: 8px;
	top: -4px;
}

.timeline .hexa:after {
	border-left-width: 8px;
	border-right-width: 8px;
	border-top: 4px solid #976653;
	bottom: -4px;
}

.direction-l,
.direction-r {
	float: none;
	width: 100%;
	text-align: center;
}

.flag-wrapper {
	text-align: center;
	position: relative;
}

.flag {
	position: relative;
	display: inline;
	z-index: 15;
	padding: 6px 10px;
	border-radius: 5px;
}

.direction-l .flag:after,
.direction-r .flag:after {
	content: '';
	position: absolute;
	left: 50%;
	top: -15px;
	height: 0;
	width: 0;
	margin-left: -8px;
	border: solid transparent;
	border-bottom-color: rgb(255, 255, 255);
	border-width: 8px;
	pointer-events: none;
}

// .direction-l .flag {
// 	-webkit-box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15),
// 		0 0 1px rgba(0, 0, 0, 0.15);
// 	-moz-box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.15);
// 	box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.15);
// }

// .direction-r .flag {
// 	-webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15),
// 		0 0 1px rgba(0, 0, 0, 0.15);
// 	-moz-box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.15);
// 	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.15);
// }

.time-wrapper {
	display: block;
	position: relative;
	margin: 4px 0 0 0;
	z-index: 14;
	line-height: 1em;
	vertical-align: middle;
	color: #fff;
}

.direction-l .time-wrapper {
	float: none;
}

.direction-r .time-wrapper {
	float: none;
}

.time {
	background: #976653;
	display: inline-block;
	padding: 8px;
}

.desc {
	position: relative;
	margin: 1em 0 0 0;
	padding: 1em;
	-webkit-box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
	-moz-box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
	box-shadow: 0 0 1px rgba(0, 0, 0, 0.2);
	z-index: 15;
}

.direction-l .desc,
.direction-r .desc {
	position: relative;
	margin: 1em 1em 0 1em;
	padding: 1em;
    padding-top: 9px;
	z-index: 15;
}

@media (min-width: 768px) {
   
	.timeline {
		width: 660px;
		margin: 0 auto;
		margin-top: 20px;
	}

	.timeline li:after {
		content: '';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}

	.timeline .hexa {
		left: -28px;
		right: auto;
		top: 8px;
	}

	.timeline .direction-l .hexa {
		left: auto;
		right: -28px;
	}

	.direction-l {
		position: relative;
		width: 310px;
		float: left;
		text-align: left;
	}

	.direction-r {
		position: relative;
		width: 310px;
		float: right;
		text-align: left;
	}

	.flag-wrapper {
		display: flex;
	}

	
	.direction-l .flag:after {
		left: auto;
		right: -16px;
		top: 50%;
		margin-top: -8px;
		border: solid transparent;
		/* border-left-color: rgb(254, 254, 254); */
		border-width: 8px;
	}

	.direction-r .flag:after {
		top: 50%;
		margin-top: -8px;
		border: solid transparent;
		/* border-right-color: rgb(254, 254, 254); */
		border-width: 8px;
		left: -8px;
	}

	.time-wrapper {
		display: inline;
		vertical-align: middle;
		margin: 0;
	}

	.direction-l .time-wrapper {
		float: left;
	}

	.direction-r .time-wrapper {
		float: right;
	}

	.time {
		padding: 5px 10px;
	}

	.direction-r .desc {
		margin: 1em 0 0 0.75em;
	}
}

@media (min-width: 992px) {
	.timeline {
		width: 840px;
		margin: 0 auto;
		margin-top: 20px;
	}

	.direction-l {
		position: relative;
		width: 400px;
		float: left;
		text-align: left;
	}

	.direction-r {
		position: relative;
		width: 400px;
		float: right;
		text-align: left;
	}

 
}

        </style>
    </head>
    <body
        style="
            background-color: #976653;
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: none;
            text-size-adjust: none;
        "
    >
        <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="nl-container"
            role="presentation"
            style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                background-color: #976653;
            "
            width="100%"
        >
            <tbody>
                <tr>
                    <td>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-1"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #ffffff;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 20px;
                                                                line-height: 20px;
                                                                font-size: 1px;
                                                            "
                                                        ></div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-2"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #ffffff;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="41.666666666666664%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="icons_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        vertical-align: middle;
                                                                        color: #000000;
                                                                        font-family: inherit;
                                                                        font-size: 14px;
                                                                        text-align: left;
                                                                        padding-top: 5px;
                                                                        padding-bottom: 5px;
                                                                    "
                                                                >
                                                                    <table
                                                                        align="left"
                                                                        cellpadding="0"
                                                                        cellspacing="0"
                                                                        class="alignment"
                                                                        role="presentation"
                                                                        style="
                                                                            mso-table-lspace: 0pt;
                                                                            mso-table-rspace: 0pt;
                                                                        "
                                                                    >
                                                                        <tr>
                                                                            <td
                                                                                style="
                                                                                    vertical-align: middle;
                                                                                    text-align: center;
                                                                                    padding-top: 5px;
                                                                                    padding-bottom: 5px;
                                                                                    padding-left: 5px;
                                                                                    padding-right: 5px;
                                                                                "
                                                                            >
                                                                                <a
                                                                                    href=${
                                                                                      dynamic.UI_URL
                                                                                    }
                                                                                    style="text-decoration: none"
                                                                                    target="_self"
                                                                                    >
                                                                                    <img
                                                                                        align="center"
                                                                                        alt=""
                                                                                        class="icon"
                                                                                        height="32"
                                                                                        style="max-height: 32px"
                                                                                        src=${
                                                                                          !dynamic.countryPicture
                                                                                            ? ""
                                                                                            : ""
                                                                                        }
                                                                                        style="
                                                                                            display: block;
                                                                                            height: auto;
                                                                                            margin: 0 auto;
                                                                                            border: 0;
                                                                                            maxWidth: "125px"
                                                                                        "
                                                                                />
                                                                                ${
                                                                                  dynamic.countryPicture
                                                                                    ? dynamic.countryPicture
                                                                                    : ""
                                                                                }

                                                                                ${
                                                                                  dynamic.logo
                                                                                    ? ` <img
                                                                                align="center"
                                                                                alt=""
                                                                                class="icon"
                                                                                height="32"
                                                                                style="max-height: 32px; object-fit: contain;"
                                                                                src=${`${dynamic.logo}`}
                                                                                style="
                                                                                    display: block;
                                                                                    height: auto;
                                                                                    margin: 0 auto;
                                                                                    border: 0;
                                                                                    
                                                                                "
                                                                                width="125"
                                                                        />`
                                                                                    : ""
                                                                                }
                                                                                
                                                                                
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="column column-2"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="58.333333333333336%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="menu_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        color: #1e2f40;
                                                                        font-family: inherit;
                                                                        font-size: 16px;
                                                                        padding-right: 15px;
                                                                        text-align: right;
                                                                        padding-top: 5px;
                                                                        padding-bottom: 5px;
                                                                    "
                                                                >
                                                                    <table
                                                                        border="0"
                                                                        cellpadding="0"
                                                                        cellspacing="0"
                                                                        role="presentation"
                                                                        style="
                                                                            mso-table-lspace: 0pt;
                                                                            mso-table-rspace: 0pt;
                                                                        "
                                                                        width="100%"
                                                                    >
                                                                        <tr>
                                                                            <td
                                                                                class="alignment"
                                                                                style="
                                                                                    text-align: right;
                                                                                    font-size: 0px;
                                                                                "
                                                                            >
                                                                                <!--[if !mso
                                                                                ]><!--><input
                                                                                    class="menu-checkbox"
                                                                                    id="menu111"
                                                                                    style="
                                                                                        display: none !important;
                                                                                        max-height: 0;
                                                                                        visibility: hidden;
                                                                                    "
                                                                                    type="checkbox"
                                                                                />
                                                                                <!--<![endif]-->
                                                                                <div
                                                                                    class="menu-trigger"
                                                                                    style="
                                                                                        display: none;
                                                                                        max-height: 0px;
                                                                                        max-width: 0px;
                                                                                        font-size: 0px;
                                                                                        overflow: hidden;
                                                                                    "
                                                                                >
                                                                                    <label
                                                                                        class="menu-label"
                                                                                        for="menu111"
                                                                                        style="
                                                                                            height: 36px;
                                                                                            width: 36px;
                                                                                            display: inline-block;
                                                                                            cursor: pointer;
                                                                                            mso-hide: all;
                                                                                            user-select: none;
                                                                                            align: right;
                                                                                            text-align: center;
                                                                                            color: #ffffff;
                                                                                            text-decoration: none;
                                                                                            background-color: #1e2f40;
                                                                                            border-radius: 0;
                                                                                        "
                                                                                        ><span
                                                                                            class="menu-open"
                                                                                            style="
                                                                                                mso-hide: all;
                                                                                                font-size: 26px;
                                                                                                line-height: 36px;
                                                                                            "
                                                                                            >☰</span
                                                                                        ><span
                                                                                            class="menu-close"
                                                                                            style="
                                                                                                display: none;
                                                                                                mso-hide: all;
                                                                                                font-size: 26px;
                                                                                                line-height: 36px;
                                                                                            "
                                                                                            >✕</span
                                                                                        ></label
                                                                                    >
                                                                                </div>
                                                                                <div class="menu-links">
                                                                                    <!--[if mso]>
<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="">
<tr>
<td style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px">
<!
                                                                                    [endif]-->
                                                                                   
                                                                                    <a
                                                                                        href=${
                                                                                          dynamic.UI_URL
                                                                                        }
                                                                                        style="
                                                                                            padding-top: 10px;
                                                                                            padding-bottom: 10px;
                                                                                            padding-left: 10px;
                                                                                            padding-right: 10px;
                                                                                            display: inline-block;
                                                                                            color: #1e2f40;
                                                                                            font-family: Arial, Helvetica Neue,
                                                                                                Helvetica, sans-serif;
                                                                                            font-size: 16px;
                                                                                            text-decoration: none;
                                                                                            letter-spacing: normal;
                                                                                        "
                                                                                        >ABOUT US</a
                                                                                    >
                                                                                    <!--[if mso]></td><td style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px"><!
                                                                                    [endif]--><a
                                                                                        href=${
                                                                                          dynamic.UI_URL
                                                                                        }
                                                                                        style="
                                                                                            padding-top: 10px;
                                                                                            padding-bottom: 10px;
                                                                                            padding-left: 10px;
                                                                                            padding-right: 10px;
                                                                                            display: inline-block;
                                                                                            color: #1e2f40;
                                                                                            font-family: Arial, Helvetica Neue,
                                                                                                Helvetica, sans-serif;
                                                                                            font-size: 16px;
                                                                                            text-decoration: none;
                                                                                            letter-spacing: normal;
                                                                                        "
                                                                                        >ECOSTANCE</a
                                                                                    >
                                                                                   
                                                                                    
                                                                                    
                                                                                   
																																										
																																										
                                                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-3"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #FAF6F1;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 15px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 65px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <h1
                                                                        style="
                                                                            margin: 0;
                                                                            color: #272727;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 48px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 120%;
                                                                            text-align: center;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <strong
                                                                            >${
                                                                              dynamic.title &&
                                                                              dynamic.title !==
                                                                                "undefined"
                                                                                ? dynamic.title
                                                                                : `We are doing our part in combating
                                                                            climate change`
                                                                            }</strong
                                                                        >
                                                                    </h1>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="text_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 15px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                    "
                                                                >
                                                                    <div style="font-family: sans-serif">
                                                                        <div
                                                                            class="txtTinyMce-wrapper"
                                                                            style="
                                                                                font-size: 12px;
                                                                                mso-line-height-alt: 24px;
                                                                                color: #5f5f5f;
                                                                                line-height: 2;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                            "
                                                                        >
                                                                            <p
                                                                                style="
                                                                                    margin: 0;
                                                                                    font-size: 14px;
                                                                                    text-align: center;
                                                                                    mso-line-height-alt: 32px;
                                                                                "
                                                                            >
                                                                                <span style="font-size: 16px"
                                                                                    >${
                                                                                      dynamic.description &&
                                                                                      dynamic.description !==
                                                                                        "undefined"
                                                                                        ? dynamic.description
                                                                                        : "We are reducing our greenhouse gas emissions everyday by wasting less, buying green, saving energy and by being conscientious consumers. But we can make only limited lifestyle changes. For our remaining emissions, we are buying carbon offsets to have a zero emission footprint. Each carbon offset we purchase goes into certified projects like planting new trees, reforestation, methane sequestration, ocean cleanup, and other such initiatives that help combat climate change today. We decided not to wait and do something today. "
                                                                                    }</span
                                                                                >
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="button_block block-4"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td class="pad">
                                                                    <div align="center" class="alignment">
                                                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href=${
                                                                          dynamic.UI_URL
                                                                        } style="height:44px;width:149px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#976653" fillcolor="#976653"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><!
                                                                        [endif]--><a
                                                                            href=${
                                                                              dynamic.UI_URL
                                                                            }
                                                                            style="
                                                                                text-decoration: none;
                                                                                display: inline-block;
                                                                                color: #ffffff;
                                                                                background-color: #976653;
                                                                                border-radius: 4px;
                                                                                width: auto;
                                                                                border-top: 1px solid #976653;
                                                                                font-weight: 400;
                                                                                border-right: 1px solid #976653;
                                                                                border-bottom: 1px solid #976653;
                                                                                border-left: 1px solid #976653;
                                                                                padding-top: 5px;
                                                                                padding-bottom: 5px;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                                text-align: center;
                                                                                mso-border-alt: none;
                                                                                word-break: keep-all;
                                                                            "
                                                                            target="_blank"
                                                                            ><span
                                                                                style="
                                                                                    padding-left: 20px;
                                                                                    padding-right: 20px;
                                                                                    font-size: 16px;
                                                                                    display: inline-block;
                                                                                    letter-spacing: normal;
                                                                                "
                                                                                ><span
                                                                                    dir="ltr"
                                                                                    style="
                                                                                        word-break: break-word;
                                                                                        line-height: 32px;
                                                                                    "
                                                                                    >LEARN MORE</span
                                                                                ></span
                                                                            ></a
                                                                        >
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-6"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        width: 100%;
                                                                        padding-right: 0px;
                                                                        padding-left: 0px;
                                                                        padding-top: 50px;
                                                                        padding-bottom: 55px;
                                                                    "
                                                                >
                                                                    <div
                                                                        align="center"
                                                                        class="alignment"
                                                                        style="line-height: 10px"
                                                                    >
                                                                        <img
                                                                            alt="Polar bear sitting on tiny ice"
                                                                            class="fullMobileWidth"
                                                                            src="../images/Polar_bear.png"
                                                                            style="
                                                                                display: block;
                                                                                height: auto;
                                                                                border: 0;
                                                                                width: 374px;
                                                                                max-width: 100%;
                                                                            "
                                                                            title="Polar bear sitting on tiny ice"
                                                                            width="374"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-4"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 60px;
                                                                line-height: 60px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-5"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspublic/pace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="33.333333333333336%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        padding-top: 20px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <h2
                                                                        style="
                                                                            margin: 0;
                                                                            color: #ffffff;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 37px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 150%;
                                                                            text-align: center;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <strong>${
                                                                          dynamic.totalOffset
                                                                        }</strong>
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="text_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 20px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                    "
                                                                >
                                                                    <div style="font-family: sans-serif">
                                                                        <div
                                                                            class="txtTinyMce-wrapper"
                                                                            style="
                                                                                font-size: 12px;
                                                                                mso-line-height-alt: 24px;
                                                                                color: #ffffff;
                                                                                line-height: 2;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                            "
                                                                        >
                                                                            <p
                                                                                style="
                                                                                    margin: 0;
                                                                                    font-size: 14px;
                                                                                    text-align: center;
                                                                                    mso-line-height-alt: 32px;
                                                                                "
                                                                            >
                                                                                <span style="font-size: 16px"
                                                                                    >GHG Reduced </span
                                                                                ><span style="font-size: 16px"
                                                                                    >(Metric Tons)</span
                                                                                >
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="column column-2"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="33.333333333333336%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        padding-top: 20px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <h2
                                                                        style="
                                                                            margin: 0;
                                                                            color: #ffffff;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 37px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 150%;
                                                                            text-align: center;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <span class="tinyMce-placeholder"
                                                                            ><strong>${
                                                                              dynamic.metricTons
                                                                            }</strong></span
                                                                        >
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="text_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 20px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                    "
                                                                >
                                                                    <div style="font-family: sans-serif">
                                                                        <div
                                                                            class="txtTinyMce-wrapper"
                                                                            style="
                                                                                font-size: 12px;
                                                                                mso-line-height-alt: 24px;
                                                                                color: #ffffff;
                                                                                line-height: 2;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                            "
                                                                        >
                                                                            <p
                                                                                style="
                                                                                    margin: 0;
                                                                                    font-size: 14px;
                                                                                    text-align: center;
                                                                                    mso-line-height-alt: 32px;
                                                                                "
                                                                            >
                                                                                <span style="font-size: 16px"
                                                                                    >Trees Planted</span
                                                                                >
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="column column-3"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="33.333333333333336%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        padding-top: 20px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <h2
                                                                        style="
                                                                            margin: 0;
                                                                            color: #ffffff;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 37px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 150%;
                                                                            text-align: center;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <span class="tinyMce-placeholder"
                                                                            ><strong>${
                                                                              dynamic.totalProjects
                                                                            }</strong></span
                                                                        >
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="text_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 20px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                    "
                                                                >
                                                                    <div style="font-family: sans-serif">
                                                                        <div
                                                                            class="txtTinyMce-wrapper"
                                                                            style="
                                                                                font-size: 12px;
                                                                                mso-line-height-alt: 24px;
                                                                                color: #ffffff;
                                                                                line-height: 2;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                            "
                                                                        >
                                                                            <p
                                                                                style="
                                                                                    margin: 0;
                                                                                    font-size: 14px;
                                                                                    text-align: center;
                                                                                    mso-line-height-alt: 32px;
                                                                                "
                                                                            >
                                                                                <span style="font-size: 16px"
                                                                                    >Projects Supporting</span
                                                                                >
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-6"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 60px;
                                                                line-height: 60px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-7"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #3D2921;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                            "
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        padding-top: 50px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                        padding-bottom: 35px;
                                                                    "
                                                                >
                                                                    <h2
                                                                        style="
                                                                            margin: 0;
                                                                            color: #ffffff;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 24px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 150%;
                                                                            text-align: center;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <strong
                                                                        class="carbon-timeline-title"
                                                                            >Carbon Offset Chain of Custody
                                                                            Certificates</strong
                                                                        >
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-8"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #3D2921;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <div
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width="100%"
                                            "
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="list_block block-1"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td class="pad" style="padding-bottom: 60px">
                                                                    <ul
                                                                        start="1"
                                                                        style="
                                                                            margin: 0;
                                                                            padding: 0;
                                                                            list-style-position: inside;
                                                                            list-style-type: revert;
                                                                            color: #f3f7fc;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 16px;
                                                                            font-weight: 400;
                                                                            letter-spacing: 0px;
                                                                            line-height: 120%;
                                                                            text-align: center;
                                                                        "
                                                                    >
                                                                        <div>
                                                                        <ul class="timeline-ref timeline">
                                                                        ${dynamic.certData.map(
                                                                          (
                                                                            each,
                                                                            index
                                                                          ) => {
                                                                            return `<li class="each-order">
                                                                                                                                                        <div class="timeline-ref ${
                                                                                                                                                          dynamic.evaluateCertSide(
                                                                                                                                                            index
                                                                                                                                                          )
                                                                                                                                                            ? `direction-r`
                                                                                                                                                            : `direction-l`
                                                                                                                                                        }">
                                                                                                                                                          <div ${
                                                                                                                                                            !dynamic.evaluateCertSide(
                                                                                                                                                              index
                                                                                                                                                            )
                                                                                                                                                              ? `style="justify-content: flex-end;"`
                                                                                                                                                              : ""
                                                                                                                                                          } class="timeline-ref flag-wrapper">
                                                                                                                                                            <span class="timeline-ref hexa"></span>
                                                                                                                                                            <a href=${
                                                                                                                                                              each
                                                                                                                                                                .certificate
                                                                                                                                                                ?.certificateURL ||
                                                                                                                                                              process
                                                                                                                                                                .env
                                                                                                                                                                .NEXT_PUBLIC_UI_URL
                                                                                                                                                            } target="__blank"
                                                                              >
                                                                                                                                                            <div class="name-date-holder" style="display: flex;">
                                                                                                                                                           
                                                                                                                                                            <span class="timeline-ref flag">Certificate:    </span>
                                                                                                                                                            <div><svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                                                                            <path d="M22.3376 0.623047H1.66242C0.745811 0.623047 0 1.36886 0 2.28547V16.3123C0 17.229 0.745811 17.9748 1.66242 17.9748H13.7184L13.3544 20.1948C13.2859 20.6127 13.4241 20.9913 13.7242 21.2073C14.0242 21.4233 14.4268 21.4349 14.8016 21.2374L17.4026 19.8683C17.4752 19.8311 17.6752 19.8311 17.7478 19.8683L20.3488 21.2374C20.5268 21.3311 20.7111 21.3777 20.8877 21.3777C21.083 21.3777 21.2688 21.3206 21.4263 21.2072C21.7263 20.9912 21.8645 20.6125 21.7961 20.1946L21.4322 17.9747H22.3377C23.2543 17.9747 24.0001 17.2289 24.0001 16.3123V2.28547C24 1.36876 23.2542 0.623047 22.3376 0.623047ZM17.5752 15.1253C15.9777 15.1253 14.6779 13.8255 14.6779 12.2279C14.6779 10.6304 15.9777 9.33054 17.5752 9.33054C19.1728 9.33054 20.4726 10.6304 20.4726 12.2279C20.4726 13.8255 19.1728 15.1253 17.5752 15.1253ZM18.4115 18.6074C17.9269 18.3523 17.2235 18.3523 16.739 18.6074L14.9001 19.5754L15.4847 16.0093C16.1047 16.3535 16.8174 16.5501 17.5753 16.5501C18.3333 16.5501 19.0459 16.3534 19.666 16.0093L19.8938 17.3996C19.8944 17.4019 19.8946 17.4043 19.895 17.4066L20.2506 19.5755L18.4115 18.6074ZM22.5751 16.3123C22.5751 16.4411 22.4663 16.5498 22.3376 16.5498H21.1985L20.9383 14.9626C20.9372 14.9563 20.9355 14.9503 20.9343 14.944C21.5361 14.2014 21.8976 13.2561 21.8976 12.2279C21.8976 9.84456 19.9587 7.90561 17.5753 7.90561C15.192 7.90561 13.253 9.84456 13.253 12.2279C13.253 13.2561 13.6146 14.2012 14.2164 14.944C14.2152 14.9502 14.2134 14.9563 14.2124 14.9625L13.952 16.5511C13.944 16.5508 13.9363 16.5498 13.9284 16.5498H1.66242C1.53371 16.5498 1.42494 16.4411 1.42494 16.3123V2.28547C1.42494 2.15675 1.53371 2.04798 1.66242 2.04798H22.3376C22.4663 2.04798 22.5751 2.15675 22.5751 2.28547V16.3123Z" fill="white"/>
                                                                                                                                                            <path d="M19.8188 4.72363H3.6695C3.27593 4.72363 2.95703 5.04253 2.95703 5.4361C2.95703 5.82967 3.27593 6.14857 3.6695 6.14857H19.8188C20.2123 6.14857 20.5312 5.82967 20.5312 5.4361C20.5312 5.04253 20.2123 4.72363 19.8188 4.72363Z" fill="white"/>
                                                                                                                                                            <path d="M10.5092 8.58691H3.6695C3.27593 8.58691 2.95703 8.90581 2.95703 9.29938C2.95703 9.69295 3.27593 10.0118 3.6695 10.0118H10.5092C10.9028 10.0118 11.2217 9.69295 11.2217 9.29938C11.2217 8.90581 10.9028 8.58691 10.5092 8.58691Z" fill="white"/>
                                                                                                                                                            </svg>
                                                                                                                                                            </div>

                                                                                                                                                           
                                                                                                                                                                                                                                                                                                                                                                               
                                                                                                                                                            <span class="timeline-ref time-wrapper"><span class="time">${
                                                                                                                                                              each
                                                                                                                                                                .certificate
                                                                                                                                                                ?.originNumber
                                                                                                                                                            }</span>
                                                                                                                                                            
                                                                                                                                                            </span>
                                                                                                                                                          
                                                                                                                                                            </div>   
                                                                                                                                                            </a> 
                                                                                                                                                          </div>
                                                                                                                                                          
                                                                                                                                                         
                                                                                                                                                          <div class="timeline-ref desc ${
                                                                                                                                                            dynamic.evaluateCertSide(
                                                                                                                                                              index
                                                                                                                                                            )
                                                                                                                                                              ? `direction-r`
                                                                                                                                                              : `direction-l`
                                                                                                                                                          }"> 
                                                                                                                                                          
                                                                                                                                                          <div class="timeline--time-quantity-holder" style="display: flex; flex-direction: column;">
                                                                                                                                                          
                                                                                                                                                       
                                                                            <div class="timeline-item-date">
                                                                            ${
                                                                              each.createdAt?.split(
                                                                                "T"
                                                                              )[0]
                                                                            }
                                                                            </div>
                                                                            </a>
                                                                                                                                                          <div class="offset-quantity-text">Carbon Offset Quantity: ${
                                                                                                                                                            each?.quantity
                                                                                                                                                          } <span>Tons</span></div>

                                                                                                                                                          </div>
                                                                                                                                                          <div class="timeline--title--paragraph--holder">
                                                                                                                                                        
                                                                                                                                                          <div class="timeline--product-name"> 
                                                                                                                                                          <a href=${
                                                                                                                                                            process
                                                                                                                                                              .env
                                                                                                                                                              .NEXT_PUBLIC_UI_URL +
                                                                                                                                                            `/shop/product-basic/` +
                                                                                                                                                            each
                                                                                                                                                              ?.product
                                                                                                                                                              ?.slug
                                                                                                                                                          }>
                                                                                                                                                          ${
                                                                                                                                                            each
                                                                                                                                                              ?.product
                                                                                                                                                              ?.name
                                                                                                                                                          }
                                                                                                                                                          </a>
                                                                                                                                                          </div>
                                                                                                                                                          
                                                                                                                                                          <div class="timeline-shorten-paragraph">
                                                                                                                                                          
                                                                                                                                                          ${dynamic.returnShortenParagraph(
                                                                                                                                                            each
                                                                                                                                                              ?.product
                                                                                                                                                              ?.shortDescription
                                                                                                                                                          )}
                                                                                                                                                              </div>
                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                               </div>
                                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                    </div>

                                                                                                                                                                                                                                                                                                                    <div class="timeline--product-image-holder-${
                                                                                                                                                                                                                                                                                                                      dynamic.evaluateCertSide(
                                                                                                                                                                                                                                                                                                                        index
                                                                                                                                                                                                                                                                                                                      )
                                                                                                                                                                                                                                                                                                                        ? `direction-r-image`
                                                                                                                                                                                                                                                                                                                        : `direction-l-image`
                                                                                                                                                                                                                                                                                                                    }">
                                                                                                                                                                                                                                                                                                                    <img style="width: 156px;" src=${
                                                                                                                                                                                                                                                                                                                      each
                                                                                                                                                                                                                                                                                                                        ?.product
                                                                                                                                                                                                                                                                                                                        ?.thumbImage[0]
                                                                                                                                                                                                                                                                                                                    } />
                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                      </li>
                                                                                                                                                      `;
                                                                          }
                                                                        )}
</ul></div>
                                                                    </ul>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-9"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #704B3D;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 20px;
                                                                line-height: 20px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-10"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #704B3D;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 35px;
                                                                line-height: 35px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-11"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #704B3D;
                                background-position: top center;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            padding-left: 10px;
                                                            padding-right: 10px;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="50%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                        padding-top: 70px;
                                                                    "
                                                                >
                                                                    <h3
                                                                        style="
                                                                            margin: 0;
                                                                            color: #edddd4;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 17px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 120%;
                                                                            text-align: left;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <strong>Our Climate Change Projects</strong>
                                                                    </h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-4"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        padding-top: 15px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <h2
                                                                        style="
                                                                            margin: 0;
                                                                            color: #ffffff;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 24px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 150%;
                                                                            text-align: left;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <span class="tinyMce-placeholder"
                                                                            >Certified with Carbon Chain of Custody
                                                                            that eliminates double counting</span
                                                                        >
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="text_block block-5"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 15px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                    "
                                                                >
                                                                    <div style="font-family: sans-serif">
                                                                        <div
                                                                            class="txtTinyMce-wrapper"
                                                                            style="
                                                                                font-size: 12px;
                                                                                mso-line-height-alt: 24px;
                                                                                color: #d3d3d3;
                                                                                line-height: 2;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                            "
                                                                        >
                                                                            <p
                                                                                style="
                                                                                    margin: 0;
                                                                                    font-size: 14px;
                                                                                    text-align: left;
                                                                                "
                                                                            >
                                                                                <span style="">
                                                                                <div>
                                                                                ${dynamic.newProjects(
                                                                                  dynamic.allProjects
                                                                                )}
                                                                                    </div>
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="10"
                                                            cellspacing="0"
                                                            class="button_block block-6"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td class="pad">
                                                                    <div align="left" class="alignment">
                                                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href=${
                                                                          dynamic.UI_URL
                                                                        } style="height:44px;width:156px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#976653" fillcolor="#FAF6F1"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#976653; font-family:Arial, sans-serif; font-size:16px"><!
                                                                        [endif]--><a
                                                                            href=${
                                                                              dynamic.UI_URL
                                                                            }
                                                                            style="
                                                                                text-decoration: none;
                                                                                display: inline-block;
                                                                                color: #976653;
                                                                                background-color: #FAF6F1;
                                                                                border-radius: 4px;
                                                                                width: auto;
                                                                                border-top: 1px solid #976653;
                                                                                font-weight: 400;
                                                                                border-right: 1px solid #976653;
                                                                                border-bottom: 1px solid #976653;
                                                                                border-left: 1px solid #976653;
                                                                                padding-top: 5px;
                                                                                padding-bottom: 5px;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                                text-align: center;
                                                                                mso-border-alt: none;
                                                                                word-break: keep-all;
                                                                            "
                                                                            target="_blank"
                                                                            ><span
                                                                                style="
                                                                                    padding-left: 20px;
                                                                                    padding-right: 20px;
                                                                                    font-size: 16px;
                                                                                    display: inline-block;
                                                                                    letter-spacing: normal;
                                                                                "
                                                                                ><span
                                                                                    dir="ltr"
                                                                                    style="
                                                                                        word-break: break-word;
                                                                                        line-height: 32px;
                                                                                    "
                                                                                    ><strong>YOU CAN TOO</strong></span
                                                                                ></span
                                                                            ></a
                                                                        >
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-8"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        width: 100%;
                                                                        padding-right: 0px;
                                                                        padding-left: 0px;
                                                                        padding-top: 35px;
                                                                        padding-bottom: 10px;
                                                                    "
                                                                >
                                                                    <div
                                                                        align="center"
                                                                        class="alignment"
                                                                        style="line-height: 10px"
                                                                    >
                                                                        <img
                                                                            alt="Plastic in Ocean"
                                                                            src="../images/ocean_pollution.jpg"
                                                                            style="
                                                                                display: block;
                                                                                height: auto;
                                                                                border: 0;
                                                                                width: 320px;
                                                                                max-width: 100%;
                                                                            "
                                                                            title="Plastic in Ocean"
                                                                            width="320"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="column column-2"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            padding-left: 10px;
                                                            padding-right: 10px;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="50%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        width: 100%;
                                                                        padding-right: 0px;
                                                                        padding-left: 0px;
                                                                        padding-top: 110px;
                                                                    "
                                                                >
                                                                    <div
                                                                        align="center"
                                                                        class="alignment"
                                                                        style="line-height: 10px"
                                                                    >
                                                                        <img
                                                                            alt="Wild fire"
                                                                            src="../images/Wild_fire.jpg"
                                                                            style="
                                                                                display: block;
                                                                                height: auto;
                                                                                border: 0;
                                                                                width: 320px;
                                                                                max-width: 100%;
                                                                            "
                                                                            title="Wild fire"
                                                                            width="320"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-5"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        width: 100%;
                                                                        padding-right: 0px;
                                                                        padding-left: 0px;
                                                                        padding-top: 100px;
                                                                        padding-bottom: 10px;
                                                                    "
                                                                >
                                                                    <div
                                                                        align="center"
                                                                        class="alignment"
                                                                        style="line-height: 10px"
                                                                    >
                                                                        <img
                                                                            alt="Garbage on beach"
                                                                            src="../images/plastic_beach.jpg"
                                                                            style="
                                                                                display: block;
                                                                                height: auto;
                                                                                border: 0;
                                                                                width: 320px;
                                                                                max-width: 100%;
                                                                            "
                                                                            title="Garbage on beach"
                                                                            width="320"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-12"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #704B3D;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 60px;
                                                                line-height: 60px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-13"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="50%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                        padding-top: 55px;
                                                                    "
                                                                >
                                                                    <h3
                                                                        style="
                                                                            margin: 0;
                                                                            color: #edddd4;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 17px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 120%;
                                                                            text-align: left;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <strong>Why Carbon Offsets</strong>
                                                                    </h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-4"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-left: 10px;
                                                                        padding-top: 15px;
                                                                        text-align: center;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <h2
                                                                        style="
                                                                            margin: 0;
                                                                            color: #ffffff;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 24px;
                                                                            font-weight: 400;
                                                                            letter-spacing: normal;
                                                                            line-height: 150%;
                                                                            text-align: left;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <span class="tinyMce-placeholder"
                                                                            >To achieve NetZero now</span
                                                                        >
                                                                    </h2>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="text_block block-5"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 15px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                    "
                                                                >
                                                                    <div style="font-family: sans-serif">
                                                                        <div
                                                                            class="txtTinyMce-wrapper"
                                                                            style="
                                                                                font-size: 12px;
                                                                                mso-line-height-alt: 24px;
                                                                                color: #d3d3d3;
                                                                                line-height: 2;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                            "
                                                                        >
                                                                            <p
                                                                                style="
                                                                                    margin: 0;
                                                                                    font-size: 14px;
                                                                                    text-align: left;
                                                                                "
                                                                            >
                                                                                Carbon Offsets allow individuals and
                                                                                businesses to invest in environmental
                                                                                projects to balance out their greenhouse
                                                                                gas (GHG) footprints. Carbon offsetting
                                                                                is reduction of GHG to make up for
                                                                                emissions that occur anywhere. These
                                                                                projects include replacing fossil fuel
                                                                                with renewable energy, replacement of
                                                                                GHG producing systems with zero or low
                                                                                emission technologies, removal or
                                                                                sequestration of carbon and methane from
                                                                                the atmosphere, ocean cleanup, clean
                                                                                water, reforestation and others. 
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="button_block block-6"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 15px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 10px;
                                                                        text-align: left;
                                                                    "
                                                                >
                                                                    <div align="left" class="alignment">
                                                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href=${
                                                                          dynamic.UI_URL
                                                                        } style="height:44px;width:151px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#976653" fillcolor="#FAF6F1"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#976653; font-family:Arial, sans-serif; font-size:16px"><!
                                                                        [endif]--><a
                                                                            href=${
                                                                              dynamic.UI_URL
                                                                            }
                                                                            style="
                                                                                text-decoration: none;
                                                                                display: inline-block;
                                                                                color: #976653;
                                                                                background-color: #FAF6F1;
                                                                                border-radius: 4px;
                                                                                width: auto;
                                                                                border-top: 1px solid #976653;
                                                                                font-weight: 400;
                                                                                border-right: 1px solid #976653;
                                                                                border-bottom: 1px solid #976653;
                                                                                border-left: 1px solid #976653;
                                                                                padding-top: 5px;
                                                                                padding-bottom: 5px;
                                                                                font-family: Arial, Helvetica Neue,
                                                                                    Helvetica, sans-serif;
                                                                                text-align: center;
                                                                                mso-border-alt: none;
                                                                                word-break: keep-all;
                                                                            "
                                                                            target="_blank"
                                                                            ><span
                                                                                style="
                                                                                    padding-left: 20px;
                                                                                    padding-right: 20px;
                                                                                    font-size: 16px;
                                                                                    display: inline-block;
                                                                                    letter-spacing: normal;
                                                                                "
                                                                                ><span
                                                                                    dir="ltr"
                                                                                    style="
                                                                                        word-break: break-word;
                                                                                        line-height: 32px;
                                                                                    "
                                                                                    ><strong>TAKE ACTION</strong></span
                                                                                ></span
                                                                            ></a
                                                                        >
                                                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                    <td
                                                        class="column column-2"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="50%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="image_block block-2"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        padding-bottom: 75px;
                                                                        padding-left: 10px;
                                                                        padding-right: 10px;
                                                                        padding-top: 15px;
                                                                        width: 100%;
                                                                    "
                                                                >
                                                                    <div
                                                                        align="center"
                                                                        class="alignment"
                                                                        style="line-height: 10px"
                                                                    >
                                                                        <img
                                                                            alt="Pollution"
                                                                            class="fullMobileWidth"
                                                                            src="../images/pollution.png"
                                                                            style="
                                                                                display: block;
                                                                                height: auto;
                                                                                border: 0;
                                                                                width: 320px;
                                                                                max-width: 100%;
                                                                            "
                                                                            title="Pollution"
                                                                            width="320"
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-14"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #3D2921;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 60px;
                                                                line-height: 60px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-15"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #3D2921;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <div
                                                            class="spacer_block"
                                                            style="
                                                                height: 60px;
                                                                line-height: 60px;
                                                                font-size: 1px;
                                                            "
                                                        >
                                                             
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-16"
                            role="presentation"
                            style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                background-color: #3D2921;
                            "
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="heading_block block-1"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="text-align: center; width: 100%"
                                                                >
                                                                    <h3
                                                                        style="
                                                                            margin: 0;
                                                                            color: #8a3c90;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 24px;
                                                                            font-weight: 700;
                                                                            letter-spacing: normal;
                                                                            line-height: 120%;
                                                                            text-align: left;
                                                                            margin-top: 0;
                                                                            margin-bottom: 0;
                                                                        "
                                                                    >
                                                                        <span
                                                                            class="tinyMce-placeholder"
                                                                            style="color: #d0cfcf"
                                                                            >About Us</span
                                                                        >
                                                                    </h3>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="paragraph_block block-3"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                                word-break: break-word;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td class="pad" style="padding-top: 21px">
                                                                    <div
                                                                        style="
                                                                            color: #101112;
                                                                            direction: ltr;
                                                                            font-family: Arial, Helvetica Neue,
                                                                                Helvetica, sans-serif;
                                                                            font-size: 16px;
                                                                            font-weight: 400;
                                                                            letter-spacing: 0px;
                                                                            line-height: 120%;
                                                                            text-align: left;
                                                                            mso-line-height-alt: 19.2px;
                                                                        "
                                                                    >
                                                                        <p style="margin: 0; margin-bottom: 23px">
                                                                            <span style="color: #d0cfcf"
                                                                                >${
                                                                                  dynamic.aboutUs &&
                                                                                  dynamic.aboutUs !==
                                                                                    "undefined"
                                                                                    ? dynamic.aboutUs
                                                                                    : `This is a paragraph about us. We are a
                                                                                family of five, living in Miami, Florida
                                                                                We are interested in playing our part in
                                                                                saving the environment and our planet.
                                                                                Living in a city that is on the front
                                                                                line of climate change gives us a front
                                                                                row-seat to the impending loom. Often
                                                                                during high tides or occasional
                                                                                torrential rains, we are inundated with
                                                                                a flooded downtown where spotting a fish
                                                                                is commonplace. We are not waiting for
                                                                                2030 or 2050 for NetZero. Yes the
                                                                                government and businesses have to play
                                                                                their part, but we as individuals can
                                                                                make a much bigger difference. If you
                                                                                can spread the word, that now there is a
                                                                                way, we have a chance.</span
                                                                            >
                                                                        </p>
                                                                        <p style="margin: 0">
                                                                            <span style="color: #d0cfcf"
                                                                                >The world you and I have inherited is
                                                                                not just ours, but we are mere
                                                                                beneficiaries of its wonders. It is our
                                                                                responsibility to take care of it so
                                                                                that we can pass it on to our
                                                                                future. </span
                                                                            >
                                                                        </p>
                                                                        `
                                                                                } 
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                       
                                                        <div style="display: flex; gap: 12px; margin-bottom: 23px; align-items: center;"> 
                                                        ${dynamic.showSocial(
                                                          "../images/email.png",
                                                          dynamic.email,
                                                          dynamic.showEmail,
                                                          true
                                                        )}
                                                      ${dynamic.showSocial(
                                                        "../images/linkedin.png",
                                                        dynamic.linkedin,
                                                        dynamic.showLinkedin
                                                      )}
                                                  ${dynamic.showSocial(
                                                    "../images/twitter.png",
                                                    dynamic.twitter,
                                                    dynamic.showTwitter
                                                  )}
                                              ${dynamic.showSocial(
                                                "../images/facebook.png",
                                                dynamic.facebook,
                                                dynamic.showFacebook
                                              )}
                                                                                                                                                                ${dynamic.showSocial(
                                                                                                                                                                  "../images/instagram.png",
                                                                                                                                                                  dynamic.instagram,
                                                                                                                                                                  dynamic.showInstagram
                                                                                                                                                                )}</div>
                                            
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table
                            align="center"
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="row-17"
                            role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
                            width="100%"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        <table
                                            align="center"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="row-content stack"
                                            role="presentation"
                                            style="
                                                mso-table-lspace: 0pt;
                                                mso-table-rspace: 0pt;
                                                color: #000000;
                                                width: 680px;
                                            "
                                            width="680"
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        class="column column-1"
                                                        style="
                                                            mso-table-lspace: 0pt;
                                                            mso-table-rspace: 0pt;
                                                            font-weight: 400;
                                                            text-align: left;
                                                            vertical-align: top;
                                                            padding-top: 5px;
                                                            padding-bottom: 5px;
                                                            border-top: 0px;
                                                            border-right: 0px;
                                                            border-bottom: 0px;
                                                            border-left: 0px;
                                                        "
                                                        width="100%"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            class="icons_block block-1"
                                                            role="presentation"
                                                            style="
                                                                mso-table-lspace: 0pt;
                                                                mso-table-rspace: 0pt;
                                                            "
                                                            width="100%"
                                                        >
                                                            <tr>
                                                                <td
                                                                    class="pad"
                                                                    style="
                                                                        vertical-align: middle;
                                                                        color: #9d9d9d;
                                                                        font-family: inherit;
                                                                        font-size: 15px;
                                                                        padding-bottom: 5px;
                                                                        padding-top: 5px;
                                                                        text-align: center;
                                                                    "
                                                                >
                                                                    <table
                                                                        cellpadding="0"
                                                                        cellspacing="0"
                                                                        role="presentation"
                                                                        style="
                                                                            mso-table-lspace: 0pt;
                                                                            mso-table-rspace: 0pt;
                                                                        "
                                                                        width="100%"
                                                                    >
                                                                        <tr>
                                                                            <td
                                                                                class="alignment"
                                                                                style="
                                                                                    vertical-align: middle;
                                                                                    text-align: center;
                                                                                "
                                                                            >
                                                                                <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                                                                <!--[if !vml]><!-->
                                                                                <table
                                                                                    cellpadding="0"
                                                                                    cellspacing="0"
                                                                                    class="icons-inner"
                                                                                    role="presentation"
                                                                                    style="
                                                                                        mso-table-lspace: 0pt;
                                                                                        mso-table-rspace: 0pt;
                                                                                        display: inline-block;
                                                                                        margin-right: -4px;
                                                                                        padding-left: 0px;
                                                                                        width:270px;
                                                                                        padding-right: 0px;
                                                                                    "
                                                                                >
                                                                                    <!--<![endif]-->
                                                                                    <tr>
                                                                                        <td
                                                                                            style="
                                                                                                vertical-align: middle;
                                                                                                text-align: center;
                                                                                                padding-top: 5px;
                                                                                                padding-bottom: 5px;
                                                                                                padding-left: 5px;
                                                                                                padding-right: 6px;
                                                                                            "
                                                                                        >
                                                                                            <a
                                                                                                
                                                                                                style="text-decoration: none"
                                                                                                target="_blank"
                                                                                                ><img
                                                                                                    align="center"
                                                                                                    alt="Ecostance"
                                                                                                    class="icon"
                                                                                                    height="32"
                                                                                                    src="../images/logo.png"
                                                                                                    style="
                                                                                                        display: block;
                                                                                                        height: auto;
                                                                                                        margin: 0 auto;
                                                                                                        border: 0;
                                                                                                    "
                                                                                                    width="34"
                                                                                            /></a>
                                                                                        </td>
                                                                                        <td
                                                                                            style="
                                                                                                font-family: Arial,
                                                                                                    Helvetica Neue, Helvetica,
                                                                                                    sans-serif;
                                                                                                font-size: 15px;
                                                                                                color: #9d9d9d;
                                                                                                vertical-align: middle;
                                                                                                letter-spacing: undefined;
                                                                                                text-align: center;
                                                                                            "
                                                                                        >
                                                                                            <a
                                                                                            href=${
                                                                                              dynamic.UI_URL
                                                                                            }
                                                                                                style="
                                                                                                    color:white;
                                                                                                    text-decoration: none;
                                                                                                "
                                                                                                target="_blank"
                                                                                                >Powered by ${dynamic.generateTextWithSpaces(
                                                                                                  "ecostance"
                                                                                                )}
                                                                                                </a
                                                                                            >
                                                                                           
                                                                                          
                                                                                        </td>
                                                                                    </tr>
                                                                                </table>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                    <p>${
                                                                      dynamic.showName
                                                                        ? "Name: " +
                                                                          dynamic.name
                                                                        : ""
                                                                    }</p>
                                                                    <p>${
                                                                      dynamic.showPhone
                                                                        ? "Phone:" +
                                                                          dynamic.phone
                                                                        : ""
                                                                    }</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- End -->
    </body>
</html>
`;

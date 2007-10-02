#$Id:$

XPI= clc_utils/clc_utils.xpi\
clc_fire-vox/clc_fire-vox.xpi\
clc_tts/clc_tts.xpi install.rdf

all: clc-bundle.xpi

clc-bundle.xpi:
	cd clc_tts && $(MAKE)
	cd clc_utils && $(MAKE)
	cd clc_fire-vox && $(MAKE)
	zip clc-bundle.xpi ${XPI}

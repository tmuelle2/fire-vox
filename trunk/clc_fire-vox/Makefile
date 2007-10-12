#$Id: Makefile 7 2007-10-12 18:31:36Z clchen@google.com $

all: clc-bundle.xpi

clc-bundle.xpi:
	cd clc_tts && $(MAKE)
	cd clc_utils && $(MAKE)
	cd clc_fire-vox && $(MAKE)
	mv clc_fire-vox/clc_fire-vox.xpi clc_fire-vox.xpi
	mv clc_utils/clc_utils.xpi clc_utils.xpi
	mv clc_tts/clc_tts.xpi clc_tts.xpi
	zip clc-bundle.xpi clc_fire-vox.xpi clc_utils.xpi clc_tts.xpi install.rdf
        rm clc_fire-vox.xpi 
        rm clc_utils.xpi 
        rm clc_tts.xpi 

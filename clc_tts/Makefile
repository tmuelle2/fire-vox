#$Id:$

all: clc_tts.xpi

clc_tts.xpi:
	cd chrome && $(MAKE)
	zip clc_tts.xpi chrome/clc_tts.jar components  install.rdf

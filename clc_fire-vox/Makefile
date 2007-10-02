#$Id:$

all: clc_fire-vox.xpi

clc_fire-vox.xpi:
	cd chrome && $(MAKE)
	zip clc_fire-vox.xpi chrome/clc_fire-vox.jar components  install.rdf

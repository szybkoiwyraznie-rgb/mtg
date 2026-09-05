#!/usr/bin/env python3
"""ravnica-v3-herby.py — herby 10 gildii na produkcyjnej mapie T2+ (v3, 6849x5292).

Wariant v4 (na bazie S7): tarcze siedzib są już narysowane w <g id="markery">
(biala obwodka r104 + kolorowy dysk r96 + bialy pierscien r70 + maly rdzen r30).
Ten skrypt dodaaje TYLKO biale glify herbow w srodek kazdej tarczy (na wierzchu),
ktore zakrywaja maly rdzen i wypelniaja wnetrze pierscienia — dokladnie styl
zatwierdzonego prototypu.

Glify: geometrycznie autorskie, inspirowane symbolika gildii (bez zastrzezonego
kluczowego elementu), w sielatce [-50,50], wstawiane przez transform.
Idempotentny: sa.woe z <g id="herby-gildii">.
"""
import re, sys, math

P = "maps/ravnica/podklad.svg"

# centrum tarczy (dysku r96) -> gildia, wyznaczane z etykiet S7
SIEDZIBY = {
    (3999, 810):  "Gruul",
    (5065, 1272): "Selesnya",
    (3742, 1773): "Boros",
    (2677, 2053): "Izzet",
    (1118, 2451): "Simic",
    (3392, 2878): "Orzhov",
    (5479, 2741): "Azorius",
    (2187, 3750): "Rakdos",
    (3850, 4321): "Golgari",
    (5054, 3976): "Dimir",
}

GLYPH_SCALE = 1.10   # glify z siatki [-50,50] -> ~r55, wnetrze pierscienia r63.5

def pts(pl):
    out=[]
    for pair in pl.strip().split():
        x,y=pair.split(","); out.append((float(x),float(y)))
    return out

def path(sub, cx, cy):
    """Generuj <path> z listy (x,y) w sielatce [-50,50], przeniesiony do (cx,cy)."""
    c = " ".join(f"{cx+x*GLYPH_SCALE:.1f},{cy+y*GLYPH_SCALE:.1f}" for x,y in sub)
    return f'<path d="M {c} Z" fill="#ffffff"/>'

def circle(cx,cy,r):
    return f'<circle cx="{cx+r*0:.0f}" cy="{cy:.0f}" r="{r*GLYPH_SCALE:.1f}" fill="#ffffff"/>'

# --- GLIFY (biale, siatka [-50,50]); autorskie, inspirowane symbolika ---
def boros(cx,cy):
    out=[f'<g id="herb-boros">']
    # promien slonca: 12 trojkatnych promieni
    for i in range(12):
        a=math.radians(i*30)
        tip=(48*math.cos(a),48*math.sin(a))
        a1=math.radians(i*30-9); a2=math.radians(i*30+9)
        b1=(24*math.cos(a1),24*math.sin(a1)); b2=(24*math.cos(a2),24*math.sin(a2))
        out.append(path([tip,b1,b2],cx,cy))
    # tarcza slonca: kolo + promien wewnetrzny
    out.append(f'<circle cx="{cx}" cy="{cy}" r="21" fill="#ffffff"/>')
    # szprychy
    for ang in (0,60,120):
        a=math.radians(ang)
        w=4
        dx,dy=math.cos(a),math.sin(a); px,py=-dy,dx
        r1,r2=4,21
        p=[(cx+dx*r1+px*w,cy+dy*r1+py*w),(cx+dx*r2+px*w,cy+dy*r2+py*w),
           (cx+dx*r2-px*w,cy+dy*r2-py*w),(cx+dx*r1-px*w,cy+dy*r1-py*w)]
        out.append(f'<path d="M '+" ".join(f"{x:.1f},{y:.1f}" for x,y in p)+' Z" fill="#ffffff"/>')
    out.append('</g>'); return "".join(out)

def selesnya(cx,cy):
    out=[f'<g id="herb-selesnya">']
    # drzewo: pień
    out.append(path([(-6,10),(6,10),(5,44),(-5,44)],cx,cy))
    # korona: 3 poziome galezie + szczyt
    for i,(y,w) in enumerate([(-40,8),(-26,16),(-12,24),(2,30)]):
        out.append(path([(-w,y-5),(w,y-5),(w-4,y+5),(-w+4,y+5)],cx,cy))
    out.append(path([(-8,-46),(8,-46),(0,-50)],cx,cy))  # szpic
    # skrzydla/liscie po bokach
    for s in (-1,1):
        out.append(path([(s*8,-18),(s*44,-30),(s*40,-18),(s*10,-8)],cx,cy))
        out.append(path([(s*8,-4),(s*40,-12),(s*36,0),(s*10,4)],cx,cy))
    out.append('</g>'); return "".join(out)

def dimir(cx,cy):
    out=[f'<g id="herb-dimir">']
    # pajak: glowa
    out.append(f'<circle cx="{cx}" cy="{cy+22}" r="11" fill="#ffffff"/>')
    # cialo (owal)
    out.append(f'<ellipse cx="{cx}" cy="{cy-2}" rx="13" ry="20" fill="#ffffff"/>')
    # 8 nog (4 pary zakrzywionych)
    for s in (-1,1):
        for i,(yy,ext) in enumerate([(-14,46),(-2,48),(10,44),(20,36)]):
            y0=cy+yy*1
            out.append(f'<path d="M {cx+s*11:.1f},{y0:.1f} C {cx+s*28:.1f},{y0-6:.1f} {cx+s*ext:.1f},{y0-22:.1f} {cx+s*ext:.1f},{y0-34:.1f}" '
                       f'fill="none" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>')
    out.append('</g>'); return "".join(out)

def izzet(cx,cy):
    out=[f'<g id="herb-izzet">']
    # blyskawica (grzbiet)
    out.append(path([(6,-48),(-16,-2),(-2,-2),(-12,48),(18,-12),(2,-12)],cx,cy))
    # krople/pary po bokach
    for s in (-1,1):
        out.append(f'<circle cx="{cx+s*30:.0f}" cy="{cy-26}" r="6.5" fill="#ffffff"/>')
        out.append(f'<circle cx="{cx+s*34:.0f}" cy="{cy+8}" r="4.5" fill="#ffffff"/>')
    out.append('</g>'); return "".join(out)

def rakdos(cx,cy):
    out=[f'<g id="herb-rakdos">']
    # 7 kolców gwiazdy (ognista korona)
    spikes=[]
    for i in range(7):
        a=math.radians(-90+i*(360/7))
        spikes.append((34*math.cos(a),34*math.sin(a)))
        a2=math.radians(-90+i*(360/7)+(360/14))
        spikes.append((13*math.cos(a2),13*math.sin(a2)))
    out.append(path(spikes,cx,cy))
    # plomien-szpic na gorze
    out.append(path([(-6,-30),(0,-50),(6,-30)],cx,cy))
    out.append('</g>'); return "".join(out)

def golgari(cx,cy):
    out=[f'<g id="herb-golgari">']
    # czasza: kopula
    out.append(path([(-34,6),(34,6),(30,-14),(18,-30),(0,-36),(-18,-30),(-30,-14)],cx,cy))
    # kropki na czaszy (skupisko much)
    for dx,dy,r in [(-16,-8,5),(0,-16,5.5),(16,-8,5),(-8,0,4),(10,1,4)]:
        out.append(f'<circle cx="{cx+dx}" cy="{cy+dy}" r="{r}" fill="{ "#12413a" if False else "#ffffff" }"/>')
    # nozki/niby lodygi pod czasza
    for s in (-1,1):
        out.append(f'<path d="M {cx+s*18:.0f},{cy+6} L {cx+s*30:.0f},{cy+34}" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none"/>')
    out.append(f'<path d="M {cx},{cy+8} L {cx},{cy+38}" stroke="#ffffff" stroke-width="6" stroke-linecap="round" fill="none"/>')
    out.append('</g>'); return "".join(out)

def azorius(cx,cy):
    out=[f'<g id="herb-azorius">']
    # szpica wiezy: iglica
    out.append(path([(-4,-48),(4,-48),(7,-10),(-7,-10)],cx,cy))
    # korpus wiezy z kolumnami
    out.append(path([(-16,-10),(16,-10),(18,34),(-18,34)],cx,cy))
    # kolumny (szczeliny kolorem tla -> biale filary)
    out.append(f'<rect x="{cx-16}" y="{cy-2}" width="32" height="36" fill="#ffffff"/>')
    # podstawa
    out.append(path([(-24,34),(24,34),(28,44),(-28,44)],cx,cy))
    out.append('</g>'); return "".join(out)

def orzhov(cx,cy):
    out=[f'<g id="herb-orzhov">']
    # okrag (moneta)
    out.append(f'<circle cx="{cx}" cy="{cy+6}" r="30" fill="none" stroke="#ffffff" stroke-width="7"/>')
    # promienie słońca nad moneta (ornament)
    for i in range(7):
        a=math.radians(-150+i*10)
        x1,y1=cx+26*math.cos(a),cy+6+26*math.sin(a)
        x2,y2=cx+42*math.cos(a),cy+6+42*math.sin(a)
        if y2<cy+6:  # tylko gorna polowa
            out.append(f'<path d="M {x1:.1f},{y1:.1f} L {x2:.1f},{y2:.1f}" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>')
    # krzyzyk / szpic monety w srodku
    out.append(path([(-5,-2),(5,-2),(5,20),(-5,20)],cx,cy))
    out.append(path([(-13,6),(13,6),(13,13),(-13,13)],cx,cy))
    out.append('</g>'); return "".join(out)

def gruul(cx,cy):
    out=[f'<g id="herb-gruul">']
    # dwuzab: dwa duże ciosy
    out.append(path([(-34,-40),(-12,-46),(-6,18),(-16,44),(-30,44),(-36,10)],cx,cy))
    out.append(path([(34,-40),(12,-46),(6,18),(16,44),(30,44),(36,10)],cx,cy))
    # szorstkie kreski (agresja)
    for s in (-1,1):
        out.append(f'<path d="M {cx+s*40:.0f},{cy-6} L {cx+s*50:.0f},{cy+18}" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>')
    # brew/szczęka
    out.append(path([(-20,-30),(20,-30),(24,-22),(-24,-22)],cx,cy))
    out.append('</g>'); return "".join(out)

def simic(cx,cy):
    out=[f'<g id="herb-simic">']
    # spirala (muszla) - zwoj
    pts_=[]
    for i in range(60):
        t=i/59*math.pi*3.2
        r=4+i*0.62
        pts_.append((r*math.cos(t),r*math.sin(t)))
    d="M "+" L ".join(f"{cx+x:.1f},{cy+y:.1f}" for x,y in pts_)
    out.append(f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>')
    # dwie kropelki wody
    out.append(f'<circle cx="{cx+34}" cy="{cy-30}" r="6" fill="#ffffff"/>')
    out.append(f'<circle cx="{cx-36}" cy="{cy+26}" r="5" fill="#ffffff"/>')
    out.append('</g>'); return "".join(out)

HERBY = {"Boros":boros,"Selesnya":selesnya,"Dimir":dimir,"Izzet":izzet,
         "Rakdos":rakdos,"Golgari":golgari,"Azorius":azorius,"Orzhov":orzhov,
         "Gruul":gruul,"Simic":simic}

def main():
    svg=open(P,encoding="utf-8").read()
    if 'id="herby-gildii"' in svg:
        svg=re.sub(r'\n<g id="herby-gildii">.*?</g>\n','\n',svg,flags=re.S)
    # dyski siedzib r=96 w <g id="markery">
    seg=re.search(r'(<g id="markery">.*?</g>)',svg,re.S).group(1)
    disks=re.findall(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="96"',seg)
    if len(disks)!=10:
        print(f"!! UWAGA: znaleziono {len(disks)} dyskow r96 (oczekiwano 10)");
    items=[]
    for dx,dy in disks:
        dx,dy=float(dx),float(dy)
        # dopasuj najblizsza siedzbe
        gildia=min(SIEDZIBY,key=lambda c:(c[0]-dx)**2+(c[1]-dy)**2)
        dist=math.hypot(gildia[0]-dx,gildia[1]-dy)
        if dist>20:
            print(f"!! dysk ({dx:.0f},{dy:.0f}) bez dopasowania (najblizszy {SIEDZIBY[gildia]} {dist:.0f}px)"); continue
        g=SIEDZIBY[gildia]
        items.append(f'  <!-- {g} -->\n  '+HERBY[g](dx,dy))
        print(f"herb {g:9} @ ({dx:.0f},{dy:.0f})")
    if len(items)!=10:
        print("!! nie wszystkie herby umieszczone — przerywam bez zapisu"); sys.exit(1)
    layer='\n<g id="herby-gildii">\n'+"\n".join(items)+'\n</g>\n'
    # wstaw bezposrednio przed <g id="etykiety"> (zaraz za markerami; glify na wierzchu tarcz)
    anchor='<g id="etykiety">'
    if anchor not in svg:
        print("!! brak kotwicy <g id=\"etykiety\">"); sys.exit(1)
    svg=svg.replace(anchor, layer+anchor, 1)
    open(P,"w",encoding="utf-8").write(svg)
    print("OK: 10 herbów (białe glify) wstawionych w tarcze S7")

if __name__=="__main__":
    main()

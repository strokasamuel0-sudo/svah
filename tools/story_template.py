from PIL import Image, ImageDraw, ImageFont
import random
W,H=1080,1920
F='/usr/share/fonts/truetype/google-fonts/'
font=lambda s,b=True: ImageFont.truetype(F+('Poppins-Bold.ttf' if b else 'Poppins-Medium.ttf'),s)
def bg():
    img=Image.new('RGB',(W,H)); d=ImageDraw.Draw(img)
    for y in range(H):
        t=y/H; d.line([(0,y),(W,y)],fill=(int(26+(196-26)*t**1.2),int(82+(222-82)*t**1.2),int(160+(244-160)*t**1.2)))
    random.seed(3)
    for i in range(200):
        x=random.random()*W; y=random.random()*H*0.7; r=random.choice([2,3,4])
        d.ellipse([x-r,y-r,x+r,y+r],fill=(255,255,255))
    d.polygon([(0,1250),(200,1050),(420,1220),(640,1080),(880,1230),(1080,1100),(1080,1920),(0,1920)],fill=(232,240,250))
    random.seed(7)
    for i in range(30):
        x=random.random()*W; y=1300+random.random()*560; hh=60+random.random()*70
        d.polygon([(x,y-hh),(x-hh*.36,y),(x+hh*.36,y)],fill=(47,93,70))
    return img,d
def st(d,xy,text,f,fill='white',sw=8): d.text(xy,text,font=f,fill=fill,anchor='mm',stroke_width=sw,stroke_fill=(16,20,28))
def board(d):
    d.rounded_rectangle([90,200,990,310],radius=28,fill=(30,90,168),outline='white',width=5)
    d.text((130,255),'Svah followerov',font=font(48),fill='white',anchor='lm')
    d.text((950,232),'NA SVAHU',font=font(22),fill='white',anchor='rm'); d.text((950,275),'316',font=font(52),fill='white',anchor='rm')
# story 1
img,d=bg(); board(d)
st(d,(540,450),'WEB UŽ BEŽÍ!',font(120),fill=(255,210,63),sw=12)
st(d,(540,570),'svahfollowerov.online',font(54))
items=['⛷  316 lyžiarov podľa vašich komentov','〰  nová kľukatá zjazdovka','🏂  snowpark so skokmi a trikmi','🚜  ratrak 5× denne (reálny čas)','🚁  horská služba každých 20 min','🏨  hotel, vlekári aj vianočný maskot']
y=720
for it in items:
    d.rounded_rectangle([90,y,990,y+110],radius=30,fill=(255,255,255))
    d.text((140,y+55),it.split('  ',1)[1],font=font(42),fill=(34,38,45),anchor='lm'); y+=135
d.rounded_rectangle([140,1560,940,1700],radius=60,fill=(30,90,168),outline='white',width=5)
d.text((540,1630),'Nájdi sa cez odkaz v bio',font=font(48),fill='white',anchor='mm')
img.save('story_web.png')
# story 2
img,d=bg(); board(d)
st(d,(540,460),'ČAKÁREŇ',font(150),fill=(255,210,63),sw=12)
st(d,(540,620),'Dal si follow, ale bez komentu?',font(52))
st(d,(540,700),'Stojíš na párty pod vlekom!',font(52))
# crowd
random.seed(5)
for i in range(70):
    x=120+random.random()*840; y=830+random.random()*260
    d.rectangle([x-14,y,x+14,y+46],fill=(138,144,153)); d.ellipse([x-12,y-26,x+12,y-2],fill=(240,201,168)); d.chord([x-13,y-30,x+13,y-4],180,360,fill=(200,16,46))
d.rounded_rectangle([90,1180,990,1500],radius=40,fill=(242,107,33))
d.text((540,1250),'Napíš do komentu:',font=font(50),fill='white',anchor='mm')
d.text((540,1330),'farbu bundy + farbu lyží',font=font(58),fill=(255,236,170),anchor='mm')
d.text((540,1420),'» ideš rovno na vlek!',font=font(56),fill='white',anchor='mm')
d.rounded_rectangle([140,1580,940,1710],radius=60,fill=(30,90,168),outline='white',width=5)
d.text((540,1645),'Komentuj pod reel!',font=font(48),fill='white',anchor='mm')
img.save('story_cakaren.png')

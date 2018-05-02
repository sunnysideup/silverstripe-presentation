<?php

class PresentationPage extends Page
{

    private static $splash_image_location = '/assets/splasimages';

    private static $db = array(
        'Website' => "Varchar(100)",
        'StartSlogan' => "Varchar(100)"
    );
    private static $has_one = array(
        'BackgroundImage' => "Image"
    );

    private static $icon = "mysite/images/treeicons/Presentation";

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $fields->addFieldToTab("Root.Splash", TextField::create('Website'));
        $fields->addFieldToTab("Root.Splash", TextField::create('StartSlogan'));
        $fields->addFieldToTab("Root.Splash", UploadField::create('BackgroundImage','Background Image'));
        $fields->addFieldToTab("Root.Splash", HtmlEditorField::create('Content'));
        return $fields;
    }

}

class PresentationPage_Controller extends Page_Controller
{


    function init()
    {
        ContentController::init();
    }


    public function index()
    {
        return $this->renderWith('PresentationPage_Splash');
    }


    /**
     * Private variables to locally cache the selected image index and
     * shuffled array with the images URLs
     */
    private $_selectedImage = null;

    private $_shuffledImages = array();


    /**
     * Returns the URL of the first image to be shown on the Splash
     * @return String
     */
    public function getRandomSplashImage()
    {

        if ($this->_selectedImage === null) {
            if($this->BackgroundImageID) {
                if($image = $this->BackgroundImage()) {
                    $this->_selectedImage = $image->Link();
                }
            }
            if ($this->_selectedImage === null) {
                $this->_shuffledImages = Config::inst()->get('PresentationPage', 'splash_images');
                shuffle($this->_shuffledImages);
                $randomIndex = array_rand($this->_shuffledImages);
                $this->_selectedImage = Config::inst()->get('PresentationPage', 'splash_image_location').
                    '/'.
                    $this->_shuffledImages[$randomIndex];
            }
        }
        return $this->_selectedImage;
    }

    /**
     * Returns the index of the first image to be shown on the Presentation Page Splash.
     * @return Integer
     */
    public function getRandomSplashImageIndex()
    {
        return $this->_selectedImage;
    }

    /**
     * Generates a Javascript Array command from the list of Shuffled images.
     * @return String
     */
    public function getJavaImageArray()
    {
        $imageArray  = $this->_shuffledImages; //Config::inst()->get('Presentation Page', 'splash_images');
        return "new Array('/images/".implode("', '/images/", $imageArray)."'),";
    }

    /**
     * Returns an html message with tags other tahn <a><span> removed.
     * @return String
     */
    public function getSplashMessageClean()
    {
        $strippedHMTL = str_replace('>', '>', $this->Content);
        $strippedHMTL = strip_tags($strippedHMTL, '<a><span>');
        $strippedHMTL = str_replace('&nbsp;', ' ', $strippedHMTL);
        $obj = DBField::create_field('Varchar', $strippedHMTL);
        $value = $obj->raw();
        $value = str_replace("'", '&rsquo;', $value);
        $value = str_replace("\r", ' ', $value);
        $value = str_replace("\n", ' ', $value);
        $value = str_replace("\t", ' ', $value);
        $value = preg_replace("/\s{1,}/", " ", $value);;
        if(strlen($value) < 10) {
            return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.';
        }

        return $value;
    }

    function PreviousPage()
    {
        return PresentationPage::get()
            ->sort(array('Sort' => 'DESC'))
            ->where('Sort < '.$this->Sort.' AND ShowInSearch = 1')
            ->First();
    }

    function NextPage()
    {
        return PresentationPage::get()
            ->where('Sort >= '.$this->Sort.'  AND ShowInSearch = 1')
            ->sort(array('Sort' => 'ASC'))
            ->exclude(array('ID' => $this->ID))
            ->First();
    }

}
